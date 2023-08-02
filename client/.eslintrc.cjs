/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const path = require("path")

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    "plugin:prettier/recommended",
  ],
  overrides: [
    {
      files: ["vite.config.ts", "tailwind.config.ts", "playwright.config.ts"],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    project: [
      path.resolve(__dirname, "./tsconfig.json"),
      path.resolve(__dirname, "./tsconfig.node.json"),
    ],
    sourceType: "module",
  },
  plugins: [
    "react-refresh",
    "typescript-sort-keys",
    "import",
    "@tanstack/query",
  ],
  root: true,
  rules: {
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    "comma-dangle": [0],
    "import/exports-last": 2,
    "import/first": 2,
    "import/no-cycle": 2,
    "import/no-default-export": 2,
    "import/no-dynamic-require": 2,
    "import/no-self-import": 2,
    "import/no-unresolved": 0,
    "no-multiple-empty-lines": [
      "error",
      {
        max: 1,
        maxEOF: 0,
      },
    ],
    "no-unused-vars": "off",
    quotes: ["error", "double"],
    "react-refresh/only-export-components": [
      "warn",
      {
        allowConstantExport: true,
      },
    ],
    semi: [0],
    "sort-keys": [
      "error",
      "asc",
      {
        caseSensitive: true,
        minKeys: 2,
        natural: true,
      },
    ],
    "@typescript-eslint/no-misused-promises": [0],
    "require-await": "off",
    "@typescript-eslint/require-await": "error",
  },
}
