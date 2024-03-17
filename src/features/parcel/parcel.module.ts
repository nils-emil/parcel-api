import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParcelController } from './application/parcel.controller';
import { ParcelService } from './domain/parcel.service';
import { ParcelTrackingService } from './domain/parce-tracking.service';
import { ParcelRepositoryMapper } from './infrastructure/mapper/parcel-repository.mapper';
import { ParcelRepository } from './infrastructure/parcel.repository';
import { ParcelCreateCommandMapper } from './application/mapper/parcel-create-command-mapper.service';
import { ParcelEntity } from './infrastructure/model/parcel.entity';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { ParcelMapper } from './application/mapper/parcel-mapper.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParcelEntity as EntityClassOrSchema])],
  providers: [
    ParcelService,
    ParcelTrackingService,
    ParcelRepositoryMapper,
    ParcelMapper,
    ParcelRepository,
    ParcelCreateCommandMapper,
  ],
  controllers: [ParcelController],
})
export class ParcelModule {}
