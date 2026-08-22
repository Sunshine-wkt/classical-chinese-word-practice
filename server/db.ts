import { and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  practiceAttempts,
  practiceResponses,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("DATABASE_UNAVAILABLE");
  return db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;

  for (const field of textFields) {
    if (user[field] === undefined) continue;
    const normalized = user[field] ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export type PilotPracticeMeta = {
  slug: string;
  title: string;
  contentVersion: string;
  questionCount: number;
};

export async function createPilotAttempt(userId: number, meta: PilotPracticeMeta) {
  const db = await requireDb();
  const result = await db.insert(practiceAttempts).values({
    userId,
    practiceSlug: meta.slug,
    practiceTitle: meta.title,
    contentVersion: meta.contentVersion,
    questionCount: meta.questionCount,
  });
  return Number(result[0].insertId);
}

export async function recordPilotResponse(input: {
  attemptId: number;
  userId: number;
  termId: string;
  selectedIndex: number;
  isCorrect: boolean;
}) {
  const db = await requireDb();

  return db.transaction(async tx => {
    const found = await tx
      .select()
      .from(practiceAttempts)
      .where(and(eq(practiceAttempts.id, input.attemptId), eq(practiceAttempts.userId, input.userId)))
      .limit(1);
    const attempt = found[0];

    if (!attempt) throw new Error("ATTEMPT_NOT_FOUND");
    if (attempt.status !== "in_progress") throw new Error("ATTEMPT_NOT_ACTIVE");

    const termResponses = await tx
      .select({ id: practiceResponses.id, isCorrect: practiceResponses.isCorrect })
      .from(practiceResponses)
      .where(and(eq(practiceResponses.attemptId, input.attemptId), eq(practiceResponses.termId, input.termId)));

    if (termResponses.some(response => response.isCorrect)) throw new Error("TERM_ALREADY_COMPLETED");

    const hasPriorResponse = termResponses.length > 0;
    const nextTotalResponseCount = attempt.totalResponseCount + 1;
    const nextCompletedCount = attempt.completedCount + (input.isCorrect ? 1 : 0);
    const nextFirstTryCorrectCount = attempt.firstTryCorrectCount + (input.isCorrect && !hasPriorResponse ? 1 : 0);

    await tx.insert(practiceResponses).values({
      attemptId: input.attemptId,
      termId: input.termId,
      selectedIndex: input.selectedIndex,
      isCorrect: input.isCorrect,
      sequenceNo: nextTotalResponseCount,
    });

    await tx
      .update(practiceAttempts)
      .set({
        firstTryCorrectCount: nextFirstTryCorrectCount,
        completedCount: nextCompletedCount,
        totalResponseCount: nextTotalResponseCount,
      })
      .where(eq(practiceAttempts.id, input.attemptId));

    return {
      firstTryCorrectCount: nextFirstTryCorrectCount,
      completedCount: nextCompletedCount,
      totalResponseCount: nextTotalResponseCount,
      termAttemptCount: termResponses.length + 1,
    };
  });
}

export async function completePilotAttempt(input: { attemptId: number; userId: number; questionCount: number }) {
  const db = await requireDb();
  const found = await db
    .select()
    .from(practiceAttempts)
    .where(and(eq(practiceAttempts.id, input.attemptId), eq(practiceAttempts.userId, input.userId)))
    .limit(1);
  const attempt = found[0];

  if (!attempt) throw new Error("ATTEMPT_NOT_FOUND");
  if (attempt.status === "completed") return attempt;
  if (attempt.status !== "in_progress" || attempt.completedCount !== input.questionCount) {
    throw new Error("ATTEMPT_NOT_READY_TO_COMPLETE");
  }

  await db
    .update(practiceAttempts)
    .set({ status: "completed", completedAt: new Date() })
    .where(eq(practiceAttempts.id, input.attemptId));

  const completed = await db.select().from(practiceAttempts).where(eq(practiceAttempts.id, input.attemptId)).limit(1);
  return completed[0];
}

export async function listPilotAttemptsForUser(userId: number) {
  const db = await requireDb();
  return db
    .select()
    .from(practiceAttempts)
    .where(eq(practiceAttempts.userId, userId))
    .orderBy(desc(practiceAttempts.startedAt));
}

export async function listYueyangPilotAttemptsForAdmin() {
  const db = await requireDb();
  return db
    .select({
      attemptId: practiceAttempts.id,
      studentName: users.name,
      studentEmail: users.email,
      practiceTitle: practiceAttempts.practiceTitle,
      contentVersion: practiceAttempts.contentVersion,
      questionCount: practiceAttempts.questionCount,
      firstTryCorrectCount: practiceAttempts.firstTryCorrectCount,
      completedCount: practiceAttempts.completedCount,
      totalResponseCount: practiceAttempts.totalResponseCount,
      status: practiceAttempts.status,
      startedAt: practiceAttempts.startedAt,
      completedAt: practiceAttempts.completedAt,
    })
    .from(practiceAttempts)
    .innerJoin(users, eq(practiceAttempts.userId, users.id))
    .where(eq(practiceAttempts.practiceSlug, "yueyang-lou-ji"))
    .orderBy(desc(practiceAttempts.startedAt));
}
