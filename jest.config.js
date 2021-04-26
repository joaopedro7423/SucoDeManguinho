module.exports = {
  // preset: 'ts-jest',
  // testEnvironment: 'node',

  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/main/**/*',
    '!<rootDir>/src/presentation/pages/components/router/**/*',
    '!<rootDir>/src/**/index.ts',
    '!**/test/**',
    '!**/*.d.ts'
  ],
   testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/main/test/cypress'
  ],
  coverageDirectory: 'coverage',
  preset: '@shelf/jest-mongodb',
  testEnvironment:'jsdom',
  transform: {
    '.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapper:{
    '@/(.*)':'<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$':'jest-transform-stub'
  }
}
