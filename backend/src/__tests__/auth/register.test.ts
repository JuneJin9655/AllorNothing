import request from "supertest";
import app from '../../server';
import bcrypt from 'bcrypt';
import  User  from '../../models/User';
import { validateUserInput, isUsernameTaken } from "../../middleware/authController";

//
jest.mock('../../models/User');
jest.mock('bcrypt');

jest.mock('../../middleware/authController', () => ({
  validateUserInput: jest.fn(),
  isUsernameTaken: jest.fn(),
}));

describe('POST /register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it('should return 400 if username or password is missing or less than 6', async () => {
    (validateUserInput as jest.Mock).mockImplementation((username: string, password: string) => {
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
    });

    const response = await request(app)
      .post('/api/auth/register')
      .send({username: 'existingUser', password: '123'});
    console.log(response.request.url);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Password must be at least 6 characters');
  });

  it('should return 400 if username taken', async () => {
    (validateUserInput as jest.Mock).mockImplementation(() => {});

    (isUsernameTaken as jest.Mock).mockImplementation((username: string) => {
      if(username === 'existingUser'){
        throw new Error('Username already exists');
      }
    });

    const response = await request(app)
      .post('/api/auth/register')
      .send({ username: 'existingUser', password: 'password123'});

    console.log(response.request.url);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'Username already exists');
  });

})