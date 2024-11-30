import { Router, Request, Response } from "express";
import Room from '../models/Room';
import authMiddleware from "../middleware/authMiddleware";
import User from '../models/User';
import mongoose from "mongoose";
import { error } from "console";

const router = Router();

router.get('/rooms', authMiddleware, async (req: Request, res: Response) => {
  try{
    
    const rooms = await Room.find().select("roomId host players status");
    res.status(200).json({ success: true, rooms});
  }catch(err){
    console.error("Error fetching rooms:", err);
    res.status(500).json({ success: false, error: "Internal server error"});
  }
});


//create room
router.post('/create', authMiddleware, async (req: Request, res: Response):Promise<void> => {
  try{
    const userId  = req.user?.userId; // JWT里的ID的命名与这个不一致发生了错误。
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: Missing userId' });
      return;
    }
    const host = await User.findById(userId);

    if(!host){
      res.status(404).json({ success: false, error: 'Host not found'});
      return;
    }

    const roomId = `room-${Math.random().toString(36).substr(2, 9)}`;
    const room = new Room({
      roomId,
      host: host._id,
      players: [host._id],
    });
    const savedRoom = await room.save();
     // 调试保存结果
    res.status(201).json({ success: true, savedRoom });

  }catch(err){
    console.error('Error creating room', err);
    res.status(500).json({ success: false, error: 'Internal server error'});
  }
});

//加入房间
router.post('/join', authMiddleware, async (req: Request, res: Response):Promise<void> => {
  try {
    const userId = (req.user as { userId: string })?.userId

    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { roomId } = req.body;

    if (!roomId || typeof roomId !== 'string') {
      res.status(400).json({ success: false, error: 'Invalid roomId' });
      return;
    }

    const room = await Room.findOne({ roomId });
    if(!room){
      res.status(404).json({ success: false, error: 'Room not found'});
      return;
    }

    if(room.players.length >= 4){
      res.status(400).json({ success: false, error: 'Room is full'});
      return;
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    await Room.updateOne({ roomId }, { $addToSet: { players: objectId } });

    // 再次查询以返回更新后的数据
    const updatedRoom = await Room.findOne({ roomId });

    res.status(200).json({ success: true, room: updatedRoom });
  } catch (error) {
    console.error('Error joining room:', { error });
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

router.post('/leave', authMiddleware, async(req: Request, res: Response):Promise<void> => {
  try{
    const userId = req.user?.userId;
    if(!userId){
      res.status(401).json({ error: 'Unauthorized'});
      return;
    }

    const { roomId } = req.body;

    const room = await Room.findOne({ roomId });
    if(!room){
      res.status(404).json({ error: 'Room not found'});
      return;
    }

    const playerIndex = room.players.findIndex((player) => player.toString() ===userId);
    if(playerIndex === -1){
      res.status(400).json({ error: 'User not in this room' });
      return;
    }
    room.players.splice(playerIndex, 1);

    if (room.players.length === 0) {
      await Room.deleteOne({ roomId });
      res.status(200).json({ success: true, message: 'Room deleted as no players were left' });
      return;
    }

    await room.save();
    res.status(200).json({ success: true, message: 'User left the room', room });
  } catch (err) {
    console.error('Error leaving room:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;