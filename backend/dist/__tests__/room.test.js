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
    yield (0, testDb_1.connect)(); // 连接内存数据库
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, testDb_1.clear)(); // 清空数据库
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, testDb_1.close)(); // 断开连接并关闭内存数据库
}));
describe('Room API', () => {
    it('should create a room successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const userRes = yield (0, supertest_1.default)(server_1.default)
            .post('/api/auth/register')
            .send({ username: 'testUser', password: 'password123' });
        const token = userRes.body.token;
        const res = yield (0, supertest_1.default)(server_1.default)
            .post('/api/room/create')
            .set('Authorization', `Bearer ${token}`)
            .send();
        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.room).toHaveProperty('roomId');
    }));
    it('should fail to create a room if not authorized', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(server_1.default).post('/api/room/create').send();
        expect(res.status).toBe(401);
    }));
});
