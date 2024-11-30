// 加载模块和环境变量
import express, { Application } from 'express';
import cors from 'cors'; //跨域问题
import connectDB from './utils/db';//封装函数用于数据库连接
import logger from './utils/logger';//日志工具，记录服务器运行时信息错误
import config from './config';//配置模块，管理环境变量（端口号，URI等等）

// 路由模块
import authRoutes from './routes/auth';
import roomRoutes from './routes/room';


// 初始化应用
const app: Application = express();
const PORT = config.PORT;

// 中间件配置
app.use(cors()); // 跨域
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 解析 URL 编码数据

// 连接数据库
if(process.env.NODE_ENV !== 'test'){
  connectDB(config.MONGO_URI);
}

// 注册路由
app.use('/api/auth', authRoutes); // 认证路由
app.use('/api/room', roomRoutes); // 房间路由

// 全局错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack); // 记录错误日志
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    },
  });
});

// 启动服务器
if(process.env.NODE_ENV !== 'test'){
app.listen(PORT, () => logger.info(`Server is running on http://localhost:${PORT}`));

}

export default app;
