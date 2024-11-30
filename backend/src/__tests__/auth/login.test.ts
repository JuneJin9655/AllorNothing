import request from 'supertest';
import app from '../../server';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('POST /login', () => {
  const mockUser = {
    username: 'testUser',
    password: 'hashedpassword',
    funds: 100,
  };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if username or passwprd is missing', async() => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Username and password are required');
  });

  it('should return 404 if user is not found', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(null); // 模拟用户不存在

    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'nonexistentuser', password: 'password123' });

    expect(User.findOne).toHaveBeenCalledWith({ username: 'nonexistentuser' });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it('should return 400 if password is incorrect', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser); // 模拟用户存在
    (bcrypt.compare as jest.Mock).mockResolvedValue(false); // 模拟密码不匹配

    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrongpassword' });

    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashedpassword');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });


   it('should return 200 and token if credentials are correct', async () => {
    (User.findOne as jest.Mock).mockResolvedValue(mockUser); // 模拟用户存在
    (bcrypt.compare as jest.Mock).mockResolvedValue(true); // 模拟密码匹配
    (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token'); // 模拟生成 JWT

    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testUser', password: 'password123' });

    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: 'testUserId' },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '1h' }
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('token', 'fake-jwt-token');
    expect(response.body.user).toMatchObject({ username: 'testUser', funds: 100 });
  });

  it('should return 500 for internal server errors', async () => {
    (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error')); // 模拟数据库错误

    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testUser', password: 'password123' });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Internal server error');
  });
});

