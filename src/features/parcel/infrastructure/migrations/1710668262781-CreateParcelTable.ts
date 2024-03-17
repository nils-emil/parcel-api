import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateParcelTable1710668262781 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'parcel',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'tracking_id',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'stock_keeping_unit',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'varchar',
          },
          {
            name: 'delivery_date',
            type: 'date',
          },
          {
            name: 'street',
            type: 'varchar',
          },
          {
            name: 'town',
            type: 'varchar',
          },
          {
            name: 'country',
            type: 'varchar',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('parcel');
  }
}
