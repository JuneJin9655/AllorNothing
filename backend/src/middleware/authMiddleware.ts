import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { error } from "console";


const authMiddleware = (req: Request, res: Response, next: NextFunction):void => {
  const authHeader = req.header('Authorization');
  console.log('Authorization Header:', authHeader);

  // 验证 Authorization 头是否存在并以 "Bearer " 开头
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');
  console.log('Token:', token);
  
  if(!token) {
    res.status(401).json({ error: 'Access denied, no token provided'});
    return;
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    console.log('Decoded Token:', decoded);


    req.user = decoded as { userId: string };
    next();
  }catch(err){
    console.error('JWT Verification Error:', err);
    res.status(400).json({ error: 'Invalid token'});
  }
};

export default authMiddleware