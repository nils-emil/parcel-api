import { DataSourceOptions } from 'typeorm';
import { ParcelEntity } from '../features/parcel/infrastructure/model/parcel.entity';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'parcel',
  username: 'parcel-api',
  password: 'parcel-password',
  entities: [ParcelEntity as EntityClassOrSchema],
};
