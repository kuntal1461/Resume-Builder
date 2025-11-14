"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const environment_1 = require("./environment");
const logger_1 = require("./logger");
const renderRouter_1 = require("./routes/renderRouter");
const createServer = () => {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    const allowedOrigins = process.env.ALLOWED_ORIGINS
        ?.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    app.use((0, cors_1.default)({
        origin: allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : true,
        optionsSuccessStatus: 200,
    }));
    app.use(express_1.default.json({ limit: '2mb' }));
    app.get('/healthz', (_req, res) => {
        res.json({ status: 'ok', uptime: process.uptime() });
    });
    app.use('/render', renderRouter_1.renderRouter);
    app.use((err, _req, res) => {
        logger_1.logger.error({ err }, 'Unhandled error in request pipeline');
        res.status(500).json({ error: 'Internal server error' });
    });
    return app;
};
exports.createServer = createServer;
const startServer = () => {
    const app = (0, exports.createServer)();
    app.listen(environment_1.env.port, () => {
        logger_1.logger.info({ port: environment_1.env.port }, 'LaTeX Renderer service listening');
    });
};
exports.startServer = startServer;
//# sourceMappingURL=server.js.map