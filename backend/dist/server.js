"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 加载模块和环境变量
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors")); //跨域问题
const db_1 = __importDefault(require("./utils/db")); //封装函数用于数据库连接
const logger_1 = __importDefault(require("./utils/logger")); //日志工具，记录服务器运行时信息错误
const config_1 = __importDefault(require("./config")); //配置模块，管理环境变量（端口号，URI等等）
// 路由模块
const auth_1 = __importDefault(require("./routes/auth"));
const room_1 = __importDefault(require("./routes/room"));
// 初始化应用
const app = (0, express_1.default)();
const PORT = config_1.default.PORT;
// 中间件配置
app.use((0, cors_1.default)()); // 跨域
app.use(express_1.default.json()); // 解析 JSON 请求体
app.use(express_1.default.urlencoded({ extended: true })); // 解析 URL 编码数据
// 连接数据库
if (process.env.NODE_ENV !== 'test') {
    (0, db_1.default)(config_1.default.MONGO_URI);
}
// 注册路由
app.use('/api/auth', auth_1.default); // 认证路由
app.use('/api/room', room_1.default); // 房间路由
// 全局错误处理
app.use((err, req, res, next) => {
    logger_1.default.error(err.stack); // 记录错误日志
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
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => logger_1.default.info(`Server is running on http://localhost:${PORT}`));
}
exports.default = app;
