import { DataSource } from 'typeorm';
import { databaseConfig } from './database-config';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';

export const connectionSource = new DataSource({
  ...databaseConfig,
  migrations: [
    './src/features/parcel/infrastructure/migrations/1710668262781-CreateParcelTable.ts',
  ],
} as DataSourceOptions);
