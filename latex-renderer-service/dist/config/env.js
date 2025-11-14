"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const coercePort = (value, fallback) => {
    if (!value) {
        return fallback;
    }
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : fallback;
};
const parseOrigins = (value) => {
    if (!value) {
        return [];
    }
    return value
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
};
exports.env = {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: coercePort(process.env.PORT, 4100),
    logLevel: process.env.LOG_LEVEL ?? 'info',
    allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGINS),
};
//# sourceMappingURL=env.js.map