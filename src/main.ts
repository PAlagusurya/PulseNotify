import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // strip fields not in the DTO
      forbidNonWhitelisted: true,  // reject requests with extra fields
      transform: true,        // auto-transform payloads to DTO instances
    }),
  );

  const configService = app.get(ConfigService)
  console.log("config service:", configService)
  const port = configService.get<number>('APP_PORT') ?? 3000

  await app.listen(port);
  console.log(`Application running on port ${port}`);
}
bootstrap();
