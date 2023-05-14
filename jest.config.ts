module.exports = {
  "roots": [
    "<rootDir>"
  ],

  "modulePaths": [
    "<rootDir>",
  ],
  "moduleDirectories": [
    "node_modules"
  ],
  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
}
