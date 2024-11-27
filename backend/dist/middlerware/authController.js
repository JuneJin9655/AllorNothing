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
exports.isUsernameTaken = exports.validateUserInput = void 0;
const User_1 = __importDefault(require("../models/User"));
const validateUserInput = (username, password) => {
    if (!username || !password) {
        throw new Error('Username and password are required');
    }
    if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
    }
};
exports.validateUserInput = validateUserInput;
const isUsernameTaken = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield User_1.default.findOne({ username });
    if (existingUser) {
        throw new Error('Username already exists');
    }
});
exports.isUsernameTaken = isUsernameTaken;
