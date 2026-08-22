import { describe, expect, it } from "vitest";
import {
  getYueyangPilotLesson,
  gradeYueyangPilotSelection,
  YUEYANG_PILOT_META,
} from "./yueyangPractice";

describe("《岳陽樓記》全端試行教材", () => {
  it("保留現有 46 題、五段原文及每題四個不重複選項", () => {
    const lesson = getYueyangPilotLesson();

    expect(YUEYANG_PILOT_META.questionCount).toBe(46);
    expect(lesson.passages).toHaveLength(5);
    expect(lesson.terms).toHaveLength(46);
    for (const term of lesson.terms) {
      expect(term.options).toHaveLength(4);
      expect(new Set(term.options).size).toBe(4);
      expect(term.excerpt).toContain(term.word);
    }
  });

  it("只在正確作答後回傳筆記正解，答錯時不洩露答案", () => {
    const correct = gradeYueyangPilotSelection("zhe", 1);
    const incorrect = gradeYueyangPilotSelection("zhe", 0);

    expect(correct).toEqual({ isCorrect: true, correctMeaning: "貶謫、貶官" });
    expect(incorrect.isCorrect).toBe(false);
    expect(incorrect.correctMeaning).toBeUndefined();
  });
});
