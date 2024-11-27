"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RoomSchema = new mongoose_1.default.Schema({
    roomId: { type: String, required: true, unique: true },
    host: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    players: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['waiting', 'playing', 'finished'], default: 'waiting' },
    createdAt: { type: Date, default: Date.now },
});
const Room = mongoose_1.default.model('Room', RoomSchema);
exports.default = Room;
