import { pathsToModuleNameMapper } from "ts-jest"

const paths = {
  "@server/*": ["./src/*"],
}

export default {
  moduleNameMapper: {
    ...pathsToModuleNameMapper(paths, {
      prefix: "<rootDir>/",
    }),
  },
  modulePathIgnorePatterns: ["<rootDir>/node_modules/"],
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.jest.json" }],
  },
}
