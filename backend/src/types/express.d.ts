import'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // 可以指定具体的类型，比如 `User` 或 `DecodedToken`
    }
  }
}
