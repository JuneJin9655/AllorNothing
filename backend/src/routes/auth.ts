import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateUserInput, isUsernameTaken } from '../middlerware/authController';
import User from '../models/User';
import { error } from 'console';

const router = Router();

// 用户注册 
router.post('/register', async (req: Request, res: Response) => { 
  const { username, password } = req.body; 


  try {
    //校验
    validateUserInput(username, password);

    //用户名唯一性
    await isUsernameTaken(username);

    //加密并保护
    const hashedPassword = await bcrypt.hash(password, 12); 
    const user = new User({ username, password: hashedPassword }); 
    await user.save(); 

    res.status(201).json({ message: 'User registered successfully' }); 
  } catch (err: any) { 
    const errorMessages = [
      'Username already exists',
      'Username and password are required',
      'Password must be at least 6 characters',
    ];

    if(errorMessages.includes(err.message)){
      res.status(400).json({ success: false, error: err.message});
    }else{
      console.error('Registration error:', err.message);
      res.status(500).json({ success: false, error: 'Internal server error'});
    }
  }
});

router.post('/login', async (req: Request, res: Response):Promise<void> => { 
  const { username, password } = req.body; 
  try { 

    validateUserInput(username, password);

    const user = await User.findOne({ username }); 
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'default_secret', {
      expiresIn: '1h',
    });

    res.status(200).json({
      success: true,
      token,
      user: { username: user.username, funds: user.funds },
    });
  } catch (err: any) {
    const errorMessages = [
      'Username and password are required',
      'Password must be at least 6 characters',
    ];

    if (errorMessages.includes(err.message)) {
      res.status(400).json({ success: false, error: err.message });
    } else {
      console.error('Login error:', err.message);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
});


export default router;