// src/types/express.d.ts
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      }; // 可以指定具体的类型，比如 `User` 或 `DecodedToken`
    }
  }
}
