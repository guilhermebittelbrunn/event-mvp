import { JestConfigWithTsJest } from 'ts-jest';

import baseConfig from './jest.config';

const config: JestConfigWithTsJest = {
  ...baseConfig,
  testRegex: '.e2e-spec.ts$',
  globalSetup: '../jest.globalSetup-e2e.ts',
  globalTeardown: '../jest.globalTeardown-e2e.ts',
  setupFilesAfterEnv: ['../src/shared/test/setup.ts'],
};

export default config;
