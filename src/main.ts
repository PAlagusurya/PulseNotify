import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  console.log("config service:", configService)
  const port = configService.get<number>('APP_PORT') ?? 3000

  await app.listen(port);
  console.log(`Application running on port ${port}`);
}
bootstrap();
