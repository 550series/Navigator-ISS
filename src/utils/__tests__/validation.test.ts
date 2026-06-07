import { describe, it, expect } from "vitest";
import {
  validateRequired,
  validateNumber,
  validateString,
  validateEnum,
  safeJsonParse,
  safeLocalStorageGet,
  safeLocalStorageSet,
  ValidationError,
} from "../validation";

describe("validation", () => {
  describe("validateRequired", () => {
    it("passes for valid values", () => {
      expect(() => validateRequired("test", "field")).not.toThrow();
      expect(() => validateRequired(0, "field")).not.toThrow();
      expect(() => validateRequired(false, "field")).not.toThrow();
    });

    it("throws for empty values", () => {
      expect(() => validateRequired("", "field")).toThrow(ValidationError);
      expect(() => validateRequired(null, "field")).toThrow(ValidationError);
      expect(() => validateRequired(undefined, "field")).toThrow(ValidationError);
    });
  });

  describe("validateNumber", () => {
    it("passes for valid numbers", () => {
      expect(() => validateNumber(42, "field")).not.toThrow();
      expect(() => validateNumber(0, "field")).not.toThrow();
      expect(() => validateNumber(-1, "field")).not.toThrow();
    });

    it("throws for non-numbers", () => {
      expect(() => validateNumber("test", "field")).toThrow(ValidationError);
      expect(() => validateNumber(NaN, "field")).toThrow(ValidationError);
    });

    it("validates min value", () => {
      expect(() => validateNumber(5, "field", { min: 0 })).not.toThrow();
      expect(() => validateNumber(-1, "field", { min: 0 })).toThrow(ValidationError);
    });

    it("validates max value", () => {
      expect(() => validateNumber(5, "field", { max: 10 })).not.toThrow();
      expect(() => validateNumber(15, "field", { max: 10 })).toThrow(ValidationError);
    });
  });

  describe("validateString", () => {
    it("passes for valid strings", () => {
      expect(() => validateString("test", "field")).not.toThrow();
    });

    it("throws for non-strings", () => {
      expect(() => validateString(123, "field")).toThrow(ValidationError);
    });

    it("validates min length", () => {
      expect(() => validateString("test", "field", { minLength: 2 })).not.toThrow();
      expect(() => validateString("t", "field", { minLength: 2 })).toThrow(ValidationError);
    });

    it("validates max length", () => {
      expect(() => validateString("test", "field", { maxLength: 10 })).not.toThrow();
      expect(() => validateString("very long string", "field", { maxLength: 5 })).toThrow(ValidationError);
    });
  });

  describe("validateEnum", () => {
    it("passes for valid enum values", () => {
      expect(() => validateEnum("a", "field", ["a", "b", "c"])).not.toThrow();
    });

    it("throws for invalid enum values", () => {
      expect(() => validateEnum("d", "field", ["a", "b", "c"])).toThrow(ValidationError);
    });
  });

  describe("safeJsonParse", () => {
    it("parses valid JSON", () => {
      expect(safeJsonParse('{"a":1}', {})).toEqual({ a: 1 });
    });

    it("returns fallback for invalid JSON", () => {
      expect(safeJsonParse("invalid", { default: true })).toEqual({ default: true });
    });
  });

  describe("safeLocalStorageGet", () => {
    it("returns stored value", () => {
      localStorage.setItem("test-key", JSON.stringify({ value: 42 }));
      expect(safeLocalStorageGet("test-key", {})).toEqual({ value: 42 });
    });

    it("returns fallback for missing key", () => {
      expect(safeLocalStorageGet("missing-key", "default")).toBe("default");
    });

    it("returns fallback for invalid JSON", () => {
      localStorage.setItem("invalid-json", "not json");
      expect(safeLocalStorageGet("invalid-json", "default")).toBe("default");
    });
  });

  describe("safeLocalStorageSet", () => {
    it("stores value successfully", () => {
      expect(safeLocalStorageSet("test-key", { value: 42 })).toBe(true);
      expect(localStorage.getItem("test-key")).toBe('{"value":42}');
    });
  });
});
