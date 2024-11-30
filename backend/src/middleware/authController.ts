import User from "../models/User";

export const validateUserInput = (username: string, password: string) => {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
};

export const isUsernameTaken = async (username: string) => {
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('Username already exists');
  }
};
