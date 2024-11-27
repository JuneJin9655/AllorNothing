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
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authController_1 = require("../middlerware/authController");
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
// 用户注册 
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        //校验
        (0, authController_1.validateUserInput)(username, password);
        //用户名唯一性
        yield (0, authController_1.isUsernameTaken)(username);
        //加密并保护
        const hashedPassword = yield bcrypt_1.default.hash(password, 12);
        const user = new User_1.default({ username, password: hashedPassword });
        yield user.save();
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (err) {
        const errorMessages = [
            'Username already exists',
            'Username and password are required',
            'Password must be at least 6 characters',
        ];
        if (errorMessages.includes(err.message)) {
            res.status(400).json({ success: false, error: err.message });
        }
        else {
            console.error('Registration error:', err.message);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        (0, authController_1.validateUserInput)(username, password);
        const user = yield User_1.default.findOne({ username });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || 'default_secret', {
            expiresIn: '1h',
        });
        res.status(200).json({
            success: true,
            token,
            user: { username: user.username, funds: user.funds },
        });
    }
    catch (err) {
        const errorMessages = [
            'Username and password are required',
            'Password must be at least 6 characters',
        ];
        if (errorMessages.includes(err.message)) {
            res.status(400).json({ success: false, error: err.message });
        }
        else {
            console.error('Login error:', err.message);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    }
}));
exports.default = router;
