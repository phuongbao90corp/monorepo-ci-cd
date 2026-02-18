/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  preset: "ts-jest",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // Only run tests on pure TypeScript files (not React Native components)
  // For React Native component testing, additional setup with jest-expo is needed
  testMatch: ["**/*.test.ts"],
};
