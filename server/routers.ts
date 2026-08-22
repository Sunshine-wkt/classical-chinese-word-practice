import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { systemRouter } from "./_core/systemRouter";
import {
  completePilotAttempt,
  createPilotAttempt,
  listPilotAttemptsForUser,
  listYueyangPilotAttemptsForAdmin,
  recordPilotResponse,
} from "./db";
import {
  getYueyangPilotLesson,
  gradeYueyangPilotSelection,
  YUEYANG_PILOT_META,
} from "./yueyangPractice";

const answerInput = z.object({
  attemptId: z.number().int().positive(),
  termId: z.string().min(1).max(64),
  selectedIndex: z.number().int().min(0).max(3),
});

function pilotError(error: unknown): never {
  const message = error instanceof Error ? error.message : "UNKNOWN_ERROR";
  const code = message === "ATTEMPT_NOT_FOUND" || message === "ATTEMPT_NOT_ACTIVE" || message === "TERM_ALREADY_COMPLETED"
    ? "BAD_REQUEST"
    : "INTERNAL_SERVER_ERROR";
  throw new TRPCError({ code, message });
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  pilot: router({
    lesson: protectedProcedure.query(() => getYueyangPilotLesson()),
    start: protectedProcedure.mutation(async ({ ctx }) => {
      try {
        const attemptId = await createPilotAttempt(ctx.user.id, YUEYANG_PILOT_META);
        return { attemptId, meta: YUEYANG_PILOT_META };
      } catch (error) {
        return pilotError(error);
      }
    }),
    answer: protectedProcedure.input(answerInput).mutation(async ({ ctx, input }) => {
      let grade;
      try {
        grade = gradeYueyangPilotSelection(input.termId, input.selectedIndex);
      } catch (error) {
        throw new TRPCError({ code: "BAD_REQUEST", message: error instanceof Error ? error.message : "INVALID_QUESTION" });
      }

      try {
        const progress = await recordPilotResponse({ ...input, userId: ctx.user.id, isCorrect: grade.isCorrect });
        return {
          ...progress,
          isCorrect: grade.isCorrect,
          correctMeaning: grade.isCorrect ? grade.correctMeaning : undefined,
        };
      } catch (error) {
        return pilotError(error);
      }
    }),
    complete: protectedProcedure.input(z.object({ attemptId: z.number().int().positive() })).mutation(async ({ ctx, input }) => {
      try {
        const attempt = await completePilotAttempt({
          attemptId: input.attemptId,
          userId: ctx.user.id,
          questionCount: YUEYANG_PILOT_META.questionCount,
        });
        return attempt;
      } catch (error) {
        return pilotError(error);
      }
    }),
    myAttempts: protectedProcedure.query(async ({ ctx }) => {
      try {
        return await listPilotAttemptsForUser(ctx.user.id);
      } catch (error) {
        return pilotError(error);
      }
    }),
  }),
  teacher: router({
    yueyangAttempts: adminProcedure.query(async () => {
      try {
        return await listYueyangPilotAttemptsForAdmin();
      } catch (error) {
        return pilotError(error);
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
