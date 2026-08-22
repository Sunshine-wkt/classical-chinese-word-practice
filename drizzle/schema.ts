import { boolean, index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * One row represents one complete or in-progress practice session.  The pilot
 * records only the information necessary to display a student's learning
 * history and a teacher's summary; it does not use a class roster.
 */
export const practiceAttempts = mysqlTable("practiceAttempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  practiceSlug: varchar("practiceSlug", { length: 64 }).notNull(),
  practiceTitle: varchar("practiceTitle", { length: 255 }).notNull(),
  contentVersion: varchar("contentVersion", { length: 64 }).notNull(),
  questionCount: int("questionCount").notNull(),
  firstTryCorrectCount: int("firstTryCorrectCount").default(0).notNull(),
  completedCount: int("completedCount").default(0).notNull(),
  totalResponseCount: int("totalResponseCount").default(0).notNull(),
  status: mysqlEnum("status", ["in_progress", "completed", "discarded"]).default("in_progress").notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
}, table => [
  index("practiceAttempts_user_started_idx").on(table.userId, table.startedAt),
  index("practiceAttempts_status_idx").on(table.status),
]);

/**
 * A server-recorded click in a pilot attempt.  Recording each choice lets the
 * server calculate first-try scores rather than relying on a browser-only
 * total.  The table deliberately stores no free-text student response.
 */
export const practiceResponses = mysqlTable("practiceResponses", {
  id: int("id").autoincrement().primaryKey(),
  attemptId: int("attemptId").notNull().references(() => practiceAttempts.id, { onDelete: "cascade" }),
  termId: varchar("termId", { length: 64 }).notNull(),
  selectedIndex: int("selectedIndex").notNull(),
  isCorrect: boolean("isCorrect").notNull(),
  sequenceNo: int("sequenceNo").notNull(),
  answeredAt: timestamp("answeredAt").defaultNow().notNull(),
}, table => [
  index("practiceResponses_attempt_sequence_idx").on(table.attemptId, table.sequenceNo),
  index("practiceResponses_attempt_term_idx").on(table.attemptId, table.termId),
]);

export type PracticeAttempt = typeof practiceAttempts.$inferSelect;
export type PracticeResponse = typeof practiceResponses.$inferSelect;
