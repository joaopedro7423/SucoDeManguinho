module.exports = {
  // preset: 'ts-jest',
  // testEnvironment: 'node',

  roots: ['<rootDir>/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!**/test/**'
  ],
  coverageDirectory: 'coverage',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.(ts/tsx)$': 'ts-jest'
  },
  moduleNameMapper:{
    '@/(.*)':'<rootDir>/src/$1'
  }
}
