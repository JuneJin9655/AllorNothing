import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


const authMiddleware = (req: Request, res: Response, next: NextFunction):void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if(!token) {
    res.status(401).json({ error: 'Access denied, no token provided'});
    return;
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    req.user = decoded as { userId: String };
    next();
  }catch(err){
    res.status(400).json({ error: 'Invalid token'});
  }
};

export default authMiddleware