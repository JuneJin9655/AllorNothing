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
exports.close = exports.clear = exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongoServer = null;
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoServer) {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    }
    const uri = mongoServer.getUri();
    if (mongoose_1.default.connection.readyState !== 0) {
        yield mongoose_1.default.disconnect();
    }
    yield mongoose_1.default.connect(uri);
    console.log('mmDatabase connected successfully');
});
exports.connect = connect;
const clear = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if ((_a = mongoose_1.default.connection) === null || _a === void 0 ? void 0 : _a.db) {
        yield mongoose_1.default.connection.db.dropDatabase(); // 清空数据库
        console.log('Database cleared successfully.');
    }
    else {
        console.error('Mongoose connection database is undefined.');
    }
});
exports.clear = clear;
const close = () => __awaiter(void 0, void 0, void 0, function* () {
    if (mongoServer) {
        yield mongoose_1.default.disconnect();
        yield mongoServer.stop();
        mongoServer = null;
    }
});
exports.close = close;
