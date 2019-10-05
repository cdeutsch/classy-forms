module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "moduleFileExtensions": ["ts", "tsx", "js"],
  "transform": {
    "\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest"
  },
  "setupFiles": [
    "raf/polyfill"
  ],
  "testRegex": "/__tests__/.*\\.(ts|tsx|js)$",
  "setupFilesAfterEnv": ["<rootDir>/src/setupTests.ts"]
}
