import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ParcelModule } from './features/parcel/parcel.module';
import { databaseConfig } from './config/database-config';
import { HealthModule } from './features/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(databaseConfig),
    ParcelModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
