"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const logger_1 = require("./infra/logger");
const app = (0, app_1.createApp)();
app.listen(env_1.env.port, () => {
    logger_1.logger.info({ port: env_1.env.port }, 'LaTeX Renderer service listening');
});
//# sourceMappingURL=main.js.map