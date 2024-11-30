import request from 'supertest';
import app from '../../server'; // Express 应用入口
import Room from '../../models/Room'; // 房间模型
import mongoose from 'mongoose';
import authMiddleware from '../../middleware/authMiddleware';

jest.mock('../../models/Room'); // Mock Room 模型
jest.mock('../../middleware/authMiddleware'); // Mock authMiddleware

describe('POST /join', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // 清除所有 Mock
  });

  it('should return 401 if user is unauthorized', async () => {
    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      res.status(401).json({ success: false, error: 'Unauthorized' });
    });

    const response = await request(app).post('/api/room/join').send({ roomId: 'room-123' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Unauthorized');
  });

  it('should return 400 if roomId is missing or invalid', async () => {
    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      req.user = { userId: 'validUserId' }; // 模拟已授权用户
      next();
    });

    const response = await request(app).post('/api/room/join').send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Invalid roomId');
  });

   it('should return 404 if room does not exist', async () => {
    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      req.user = { userId: 'validUserId' };
      next();
    });

    (Room.findOne as jest.Mock).mockResolvedValue(null); // 模拟房间不存在

    const response = await request(app).post('/api/room/join').send({ roomId: 'nonexistentRoom' });

    expect(Room.findOne).toHaveBeenCalledWith({ roomId: 'nonexistentRoom' });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Room not found');
  });

   it('should return 400 if room is full', async () => {
    const mockRoom = {
      roomId: 'room-123',
      players: new Array(4).fill(new mongoose.Types.ObjectId()), // 模拟已满 4 人
    };

    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      req.user = { userId: 'validUserId' };
      next();
    });

    (Room.findOne as jest.Mock).mockResolvedValue(mockRoom); // 模拟房间存在

    const response = await request(app).post('/api/room/join').send({ roomId: 'room-123' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Room is full');
  });



  it('should return 200 and updated room if user joins successfully', async () => {
    const validObjectId = new mongoose.Types.ObjectId(); // 生成一个合法的 ObjectId

    const mockRoom = {
      roomId: 'room-123',
      players: [validObjectId],
    };

    const updatedRoom = {
      ...mockRoom,
      players: [...mockRoom.players, validObjectId], // 模拟更新后的玩家列表
    };



    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      req.user = { userId: validObjectId.toString() };
      next();
    });

    (Room.findOne as jest.Mock)
      .mockResolvedValueOnce(mockRoom) // 第一次查询：找到房间
      .mockResolvedValueOnce(updatedRoom); // 第二次查询：返回更新后的房间

    (Room.updateOne as jest.Mock).mockResolvedValue({ acknowledged: true, modifiedCount: 1 }); // 模拟更新成功

    const response = await request(app).post('/api/room/join').send({ roomId: 'room-123' });

    expect(Room.findOne).toHaveBeenCalledWith({ roomId: 'room-123' });
    expect(Room.updateOne).toHaveBeenCalledWith(
      { roomId: 'room-123' },
      { $addToSet: { players: validObjectId } }
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.room).toHaveProperty('roomId', 'room-123');
    expect(response.body.room.players.length).toBe(updatedRoom.players.length);
  });

  it('should return 500 for internal server errors', async () => {
    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      req.user = { userId: 'validUserId' };
      next();
    });

    (Room.findOne as jest.Mock).mockRejectedValue(new Error('Database error')); // 模拟数据库错误

    const response = await request(app).post('/api/room/join').send({ roomId: 'room-123' });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Internal server error');
  });

});
