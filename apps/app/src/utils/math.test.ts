import { add, formatThemeColor } from "./math";

describe("math utils", () => {
  describe("add", () => {
    it("should add two numbers correctly", () => {
      expect(add(2, 3)).toBe(5);
      expect(add(-1, 1)).toBe(0);
      expect(add(0, 0)).toBe(0);
    });
  });

  describe("formatThemeColor", () => {
    it("should format color to lowercase", () => {
      expect(formatThemeColor("RED")).toBe("red");
      expect(formatThemeColor("Blue")).toBe("blue");
    });

    it("should trim whitespace", () => {
      expect(formatThemeColor("  red  ")).toBe("red");
    });
  });
});
