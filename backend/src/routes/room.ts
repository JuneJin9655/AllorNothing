import { Router, Request, Response } from "express";
import Room from '../models/Room';
import authMiddleware from "../middlerware/authMiddleware";
import User from '../models/User';
import { error } from "console";

const router = Router();

//create room
router.post('/create', authMiddleware, async (req: Request, res: Response):Promise<void> => {
  try{
    const { userId } = req.user?.userId;;
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

    await room.save();
    res.status(201).json({ success: true, room });
  }catch(err){
    console.error('Error creating room', err);
    res.status(500).json({ success: false, error: 'Internal server error'});
  }
});

//加入房间
router.post('/join', authMiddleware, async (req: Request, res: Response):Promise<void> => {
  try {
    const { userId } = req.user?.userId;

    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const { roomId } = req.body;
    const room = await Room.findOne({ roomId });
    
    if(!room){
      res.status(404).json({ success: false, error: 'Room not found'});
      return;
    }

    if(room.players.length >= 4){
      res.status(400).json({ success: false, error: 'Room is full'});
      return;
    }

    if(!room.players.includes(userId)){
      room.players.push(userId);
      await room.save();
    }

    res.status(200).json({ success: true, room });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ success: false, error: 'Internal server error'});
  }
})

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