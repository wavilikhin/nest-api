import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    SwaggerModule,
    DocumentBuilder,
    SwaggerDocumentOptions,
} from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('/api');

    const config = new DocumentBuilder()
        .setTitle('Top courses api')
        .setDescription('The API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const options: SwaggerDocumentOptions = {
        ignoreGlobalPrefix: true,
    };

    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}
bootstrap();
