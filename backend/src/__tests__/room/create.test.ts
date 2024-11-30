import request from 'supertest';
import app from '../../server'
import User from '../../models/User';
import Room from '../../models/Room';
import authMiddleware from '../../middleware/authMiddleware';


jest.mock('../../models/User');
jest.mock('../../models/Room');
jest.mock('../../middleware/authMiddleware');

describe('POST /create', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if user is not authorized', async () => {
    // 模拟 authMiddleware 拒绝请求
    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      res.status(401).json({ error: 'Unauthorized: Missing userId' });
    });

    const response = await request(app).post('/api/room/create');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Unauthorized: Missing userId');
  });

  it('should return 404 if user does not exist', async () => {
    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      req.user = { userId: 'nonexistentUserId' }; // 模拟 JWT 解码后的用户ID
      next();
    });

    (User.findById as jest.Mock).mockResolvedValue(null); // 模拟用户不存在
    

    const response = await request(app).post('/api/room/create').set('Authorization', 'Bearer fake-jwt');

    expect(User.findById).toHaveBeenCalledWith('nonexistentUserId');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Host not found');
  });

  it('should return 201 and room details if room is created successfully', async () => {
  const mockUser = { _id: 'validUserId', username: 'testuser' };
  const mockRoom = {
    roomId: 'room-123',
    host: mockUser._id,
    players: [mockUser._id],
    status: 'waiting',
    createdAt: new Date().toISOString(),
  };

  (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
    req.user = { userId: 'validUserId' };
    next();
  });

  (User.findById as jest.Mock).mockResolvedValue(mockUser);
  (Room.prototype.save as jest.Mock).mockResolvedValue(mockRoom);


  const response = await request(app).post('/api/room/create').set('Authorization', 'Bearer fake-jwt');

  console.log('Response Body:', response.body); // 调试响应体

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('success', true);
  expect(response.body.savedRoom).toMatchObject({
    roomId: 'room-123',
    host: 'validUserId',
    players: ['validUserId'],
    status: 'waiting',
  });

  // 验证 createdAt 是否存在并为有效日期
  expect(response.body.savedRoom).toHaveProperty('createdAt');
  expect(new Date(response.body.savedRoom.createdAt)).toBeInstanceOf(Date);
  });
  
});