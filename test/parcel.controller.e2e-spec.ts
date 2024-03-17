import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { ParcelEntity } from '../src/features/parcel/infrastructure/model/parcel.entity';
import { DataSource, Repository } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../src/config/database-config';
import { ParcelRepository } from '../src/features/parcel/infrastructure/parcel.repository';
import { mainConfig } from '../src/config/main.config';
import { ParcelCreateDto } from '../src/features/parcel/application/model/parcel-create.dto.model';

async function insertTestDataForQueryTesting(app: INestApplication<any>) {
  await request(app.getHttpServer())
    .post('/api/parcel')
    .send({
      stockKeepingUnit: 'SKU-01',
      description: 'desc1',
      deliveryDate: new Date('2024-03-17'),
      street: '123 Main St',
      town: 'Townsville',
      country: 'Germany',
    })
    .expect(201);

  await request(app.getHttpServer())
    .post('/api/parcel')
    .send({
      stockKeepingUnit: 'SKU-02',
      description: 'desc2',
      deliveryDate: new Date('2024-03-17'),
      street: '123 Main St',
      town: 'Townsville',
      trackingId: '123',
      country: 'Germany',
    })
    .expect(201);
  await request(app.getHttpServer())
    .post('/api/parcel')
    .send({
      stockKeepingUnit: 'SKU-03',
      description: 'desc1',
      deliveryDate: new Date('2024-03-17'),
      street: '123 Main St',
      town: 'Townsville',
      country: 'Estonia',
    })
    .expect(201);
  await request(app.getHttpServer())
    .post('/api/parcel')
    .send({
      stockKeepingUnit: 'SKU-04',
      description: 'desc2',
      deliveryDate: new Date('2024-03-17'),
      street: '123 Main St',
      town: 'Townsville 4',
      country: 'Estonia',
    })
    .expect(201);
}

describe('ParcelController (e2e)', () => {
  let app: INestApplication;
  let parcelEntityRepository: Repository<ParcelEntity>;
  let datasource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forRoot(databaseConfig)],
    }).compile();
    app = module.createNestApplication();
    mainConfig(app);
    await app.init();
    parcelEntityRepository = module.get(ParcelRepository, { strict: false });
    datasource = module.get(DataSource, { strict: false });
    await datasource.createQueryBuilder().delete().from(ParcelEntity).execute();
  });

  it('/GET parcels', async () => {
    await parcelEntityRepository.save({
      stockKeepingUnit: 'SKU1',
      description: 'A parcel',
      deliveryDate: new Date('2024-03-17'),
      street: '123 Main St',
      town: 'Townsville',
      trackingId: '123',
      country: 'Germany',
    });
    return request(app.getHttpServer())
      .get('/api/parcels')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toEqual(1);
        expect(res.body[0].stockKeepingUnit).toEqual('SKU1');
        expect(res.body[0].description).toEqual('A parcel');
        expect(new Date(res.body[0].deliveryDate)).toEqual(
          new Date('2024-03-17Z'),
        );
        expect(res.body[0].street).toEqual('123 Main St');
        expect(res.body[0].town).toEqual('Townsville');
        expect(res.body[0].country).toEqual('Germany');
        expect(res.body[0].trackingId).toEqual('123');
      });
  });

  it('/GET parcels - can search by country and description', async () => {
    await insertTestDataForQueryTesting(app);
    return request(app.getHttpServer())
      .get('/api/parcels?country=Germany&description=desc1')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toEqual(1);
        expect(res.body[0].description).toEqual('desc1');
        expect(res.body[0].country).toEqual('Germany');
      });
  });

  it('/GET parcels - can search by country', async () => {
    await insertTestDataForQueryTesting(app);
    return request(app.getHttpServer())
      .get('/api/parcels?country=Germany')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toEqual(2);
        expect(res.body[0].description).toEqual('desc1');
        expect(res.body[0].country).toEqual('Germany');
        expect(res.body[1].description).toEqual('desc2');
        expect(res.body[1].country).toEqual('Germany');
      });
  });

  it('/GET parcels - can search by description', async () => {
    await insertTestDataForQueryTesting(app);
    return request(app.getHttpServer())
      .get('/api/parcels?description=desc1')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toEqual(2);
        expect(res.body[0].description).toEqual('desc1');
        expect(res.body[0].country).toEqual('Estonia');
        expect(res.body[1].description).toEqual('desc1');
        expect(res.body[1].country).toEqual('Germany');
      });
  });

  it('/POST parcel - created object is returned with a tracking ID', () => {
    const parcelData: ParcelCreateDto = {
      stockKeepingUnit: 'SKU',
      description: 'A parcel',
      deliveryDate: '2024-03-17T12:11:19.769Z',
      street: '123 Main St',
      town: 'Townsville',
      country: 'Estonia',
    };

    return request(app.getHttpServer())
      .post('/api/parcel')
      .send(parcelData)
      .expect(201)
      .expect((res) => {
        expect(res.body.stockKeepingUnit).toEqual(parcelData.stockKeepingUnit);
        expect(res.body.description).toEqual(parcelData.description);
        expect(new Date(res.body.deliveryDate)).toEqual(
          new Date(parcelData.deliveryDate),
        );
        expect(res.body.street).toEqual(parcelData.street);
        expect(res.body.town).toEqual(parcelData.town);
        expect(res.body.country).toEqual(parcelData.country);
        expect(res.body.trackingId).not.toBeNull();
      });
  });

  it('/POST parcel - can retrieve with /GET', async () => {
    const parcelData: ParcelCreateDto = {
      stockKeepingUnit: 'SKU55',
      description: 'A parcel description',
      deliveryDate: '2024-03-17',
      street: 'Koidu',
      town: 'Tallinn',
      country: 'Estonia',
    };

    await request(app.getHttpServer())
      .post('/api/parcel')
      .send(parcelData)
      .expect(201);
    return request(app.getHttpServer())
      .get('/api/parcels')
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toEqual(1);
        expect(res.body[0].stockKeepingUnit).toEqual('SKU55');
        expect(res.body[0].description).toEqual('A parcel description');
        expect(new Date(res.body[0].deliveryDate)).toEqual(
          new Date('2024-03-17'),
        );
        expect(res.body[0].street).toEqual('Koidu');
        expect(res.body[0].town).toEqual('Tallinn');
        expect(res.body[0].country).toEqual('Estonia');
        expect(res.body[0].trackingId).not.toBeNull();
      });
  });

  it('/POST parcel - does not allow duplicate stockKeepingUnit', async () => {
    const parcelData: ParcelCreateDto = {
      stockKeepingUnit: 'SKU55',
      description: 'A parcel description',
      deliveryDate: '2024-03-17',
      street: 'Koidu',
      town: 'Tallinn',
      country: 'Estonia',
    };
    await request(app.getHttpServer())
      .post('/api/parcel')
      .send(parcelData)
      .expect(201);
    return await request(app.getHttpServer())
      .post('/api/parcel')
      .send(parcelData)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toEqual('Bad Request');
        expect(res.body.message[0]).toEqual(
          'stockKeepingUnit value already exists',
        );
        expect(res.body.statusCode).toEqual(400);
      });
  });

  it('/POST parcel - Empty values return bad request', () => {
    const parcelData = {};
    return request(app.getHttpServer())
      .post('/api/parcel')
      .send(parcelData)
      .expect(400)
      .expect((res) => {
        expect(res.body.error).toEqual('Bad Request');
        expect(res.body.message[0]).toEqual(
          'stockKeepingUnit should not be empty',
        );
        expect(res.body.message[1]).toEqual(
          'stockKeepingUnit must be a string',
        );
        expect(res.body.message[2]).toEqual('description should not be empty');
        expect(res.body.message[3]).toEqual('description must be a string');
        expect(res.body.message[4]).toEqual(
          'deliveryDate must be a valid ISO 8601 date string',
        );
        expect(res.body.message[5]).toEqual('street should not be empty');
        expect(res.body.message[6]).toEqual('street must be a string');
        expect(res.body.message[7]).toEqual('town should not be empty');
        expect(res.body.message[8]).toEqual('town must be a string');
        expect(res.body.message[9]).toEqual('country should not be empty');
        expect(res.body.message[10]).toEqual('country must be a string');
        expect(res.body.statusCode).toEqual(400);
      });
  });

  it('/POST parcel - works with long values', () => {
    const parcelData: ParcelCreateDto = {
      stockKeepingUnit: 'stockKeepingUnit'.repeat(255),
      description: 'description'.repeat(255),
      deliveryDate: '2024-03-17',
      street: 'street'.repeat(255),
      town: 'town'.repeat(255),
      country: 'country'.repeat(255),
    };

    return request(app.getHttpServer())
      .post('/api/parcel')
      .send(parcelData)
      .expect(201);
  });
});
