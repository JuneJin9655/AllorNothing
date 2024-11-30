"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const testDb_1 = require("../utils/testDb");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, testDb_1.connect)();
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, testDb_1.clear)();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, testDb_1.close)();
}));
describe('Auth API', () => {
    it('should register a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(server_1.default)
            .post('api/auth/register')
            .send({ username: 'testUser', password: 'password123' });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('User registered successfully');
    }));
    it('should fail to register with missing fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(server_1.default)
            .post('/api/auth/register')
            .send({ username: 'testUser' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Password is required');
    }));
    it('should login a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(server_1.default)
            .post('/api/auth/register')
            .send({ username: 'testUser', password: 'password123' });
        const res = yield (0, supertest_1.default)(server_1.default)
            .post('/api/auth/login')
            .send({ username: 'testUser', password: 'password123' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    }));
    it('should fail to login with invalid credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(server_1.default)
            .post('/api/auth/login')
            .send({ username: 'testUser', password: 'wrongPassword' });
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Invalid credentials');
    }));
});
