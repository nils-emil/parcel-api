import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication, Logger } from '@nestjs/common';
import { mainConfig } from './config/main.config';

const getApplicationPort = (app: INestApplication): number => {
  const configService: ConfigService = app.get(ConfigService);
  return <number>configService.get('port');
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  mainConfig(app);
  const port = getApplicationPort(app);
  const logger = new Logger('bootstrap');
  logger.log(`Starting application on port ${port}`);
  await app.listen(port);
}

bootstrap();
