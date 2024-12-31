import { pathsToModuleNameMapper, type JestConfigWithTsJest } from 'ts-jest'
import { compilerOptions } from './tsconfig.paths.json'

const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/dist/'],
  moduleDirectories: ['node_modules', '<rootDir>'],

  // Configuraciones tomadas directamente del package.json
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '__tests__/.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
}

export default jestConfig
