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
const Room_1 = __importDefault(require("../models/Room"));
const authMiddleware_1 = __importDefault(require("../middlerware/authMiddleware"));
const User_1 = __importDefault(require("../models/User"));
const router = (0, express_1.Router)();
//create room
router.post('/create', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userId } = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        ;
        const host = yield User_1.default.findById(userId);
        if (!host) {
            return res.status(404).json({ success: false, error: 'Host not found' });
        }
        const roomId = `room-${Math.random().toString(36).substr(2, 9)}`;
        const room = new Room_1.default({
            roomId,
            host: host._id,
            players: [host._id],
        });
        yield room.save();
        res.status(201).json({ success: true, room });
    }
    catch (err) {
        console.error('Error creating room', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}));
//加入房间
router.post('/join', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userId } = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }
        const { roomId } = req.body;
        const room = yield Room_1.default.findOne({ roomId });
        if (!room) {
            res.status(404).json({ success: false, error: 'Room not found' });
            return;
        }
        if (room.players.length >= 4) {
            res.status(400).json({ success: false, error: 'Room is full' });
            return;
        }
        if (!room.players.includes(userId)) {
            room.players.push(userId);
            yield room.save();
        }
        res.status(200).json({ success: true, room });
    }
    catch (error) {
        console.error('Error joining room:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
}));
exports.default = router;
