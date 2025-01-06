/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  silent: true,
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};