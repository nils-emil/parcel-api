import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../src/config/database-config';
import { mainConfig } from '../src/config/main.config';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forRoot(databaseConfig)],
    }).compile();
    app = module.createNestApplication();
    mainConfig(app);
    await app.init();
  });

  it('/GET health - is OK', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.info.database.status).toEqual('up');
      });
  });
});
