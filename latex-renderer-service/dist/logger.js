"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const environment_1 = require("./environment");
const options = {
    name: 'latex-renderer-service',
    level: environment_1.env.logLevel,
};
if (environment_1.env.nodeEnv === 'development') {
    options.transport = {
        target: 'pino-pretty',
        options: { colorize: true },
    };
}
exports.logger = (0, pino_1.default)(options);
//# sourceMappingURL=logger.js.map