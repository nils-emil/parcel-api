import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { mainConfig } from './config/main.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  mainConfig(app);
  const logger = new Logger('bootstrap');
  const port = 3000;
  logger.log(`Starting application on port ${port}`);
  await app.listen(port);
}

bootstrap();
