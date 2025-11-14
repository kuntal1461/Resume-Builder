"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const env_1 = require("./config/env");
const logger_1 = require("./infra/logger");
const render_router_1 = require("./modules/render/render.router");
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: env_1.env.allowedOrigins.length > 0 ? env_1.env.allowedOrigins : true,
        optionsSuccessStatus: 200,
    }));
    app.use(express_1.default.json({ limit: '2mb' }));
    app.get('/healthz', (_req, res) => {
        res.json({ status: 'ok', uptime: process.uptime() });
    });
    app.use('/render', render_router_1.renderRouter);
    app.use((err, _req, res, next) => {
        logger_1.logger.error({ err }, 'Unhandled error in request pipeline');
        if (res.headersSent) {
            return next(err);
        }
        res.status(500).json({ error: 'Internal server error' });
    });
    return app;
};
exports.createApp = createApp;
//# sourceMappingURL=app.js.map