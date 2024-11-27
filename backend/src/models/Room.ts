import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['waiting', 'playing', 'finished'], default: 'waiting' },
  createdAt: {type: Date, default: Date.now},
});

const Room = mongoose.model('Room', RoomSchema);

export default Room;