"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const PORT = process.env.PORT || 4202;
    const apiPrefix = process.env.API_PREFIX;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix(apiPrefix);
    app.enableShutdownHooks();
    const config = new swagger_1.DocumentBuilder()
        .addBearerAuth()
        .setTitle('TMS API')
        .setDescription('Treasury Management System REST API docs')
        .setVersion('1.1.0')
        .addTag('REST API')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(`${apiPrefix}/docs`, app, document);
    await app.listen(PORT);
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}...`.yellow.bold);
}
;
(async () => bootstrap())();
//# sourceMappingURL=main.js.map