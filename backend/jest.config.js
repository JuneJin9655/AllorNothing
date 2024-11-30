/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest', // 使用 ts-jest 预处理器
  testEnvironment: 'node', // 测试运行环境
  moduleFileExtensions: ['ts', 'js', 'json'], // 测试文件的扩展名
  roots: ['<rootDir>/src'], // 项目根目录
  testMatch: ["<rootDir>/src/__tests__/**/*.test.ts"], // 匹配测试文件
  clearMocks: true, // 每次测试后清除 mock
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // 可选：测试运行前的初始化文件
};
