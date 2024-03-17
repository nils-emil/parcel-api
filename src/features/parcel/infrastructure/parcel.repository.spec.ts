import { Like, Not, Repository } from 'typeorm';
import { ParcelRepository } from './parcel.repository';
import { ParcelRepositoryMapper } from './mapper/parcel-repository.mapper';
import { ParcelEntity } from './model/parcel.entity';
import { QueryParcelCommand } from '../domain/model/command/query-parcel.command';
import { Parcel } from '../domain/model/parcel.model';

describe('ParcelRepository', () => {
  let parcelRepository: ParcelRepository;
  let parcelRepositoryMapper: jest.Mocked<ParcelRepositoryMapper>;
  let parcelEntityRepository: jest.Mocked<Repository<ParcelEntity>>;

  beforeEach(() => {
    parcelRepositoryMapper = new ParcelRepositoryMapper() as any;
    parcelEntityRepository = new Repository<ParcelEntity>(
      null as any,
      null as any,
    ) as any;
    parcelRepository = new ParcelRepository(
      parcelRepositoryMapper,
      parcelEntityRepository,
    );
  });

  it('should find all parcels by search', async () => {
    const query: QueryParcelCommand = {
      country: 'Germany',
      description: 'bier',
    };
    const result: ParcelEntity[] = [
      {
        id: 1,
        trackingId: '123',
        stockKeepingUnit: 'SKU',
        description: 'A parcel',
        deliveryDate: new Date('2024-03-17T12:11:19.769Z'),
        street: '123 Main St',
        town: 'Townsville',
        country: 'Germany',
      },
    ];

    // @ts-ignore
    jest.spyOn(parcelEntityRepository, 'find').mockReturnValue(result);

    expect(await parcelRepository.findAll(query)).toStrictEqual([
      {
        country: 'Germany',
        deliveryDate: new Date('2024-03-17T12:11:19.769Z'),
        description: 'A parcel',
        stockKeepingUnit: 'SKU',
        street: '123 Main St',
        town: 'Townsville',
        trackingId: '123',
      },
    ]);
    expect(parcelEntityRepository.find).toHaveBeenCalledWith({
      where: {
        country: 'Germany',
        description: Like(`%${query.description}%`),
      },
      order: {
        deliveryDate: 'ASC',
      },
    });
  });

  it('should find all parcels if no query criteria', async () => {
    const query: QueryParcelCommand = {};
    const result: ParcelEntity[] = [
      {
        id: 1,
        trackingId: '123',
        stockKeepingUnit: 'SKU',
        description: 'A parcel',
        deliveryDate: new Date('2024-03-17T12:11:19.769Z'),
        street: '123 Main St',
        town: 'Townsville',
        country: 'Estonia',
      },
    ];

    // @ts-ignore
    jest.spyOn(parcelEntityRepository, 'find').mockReturnValue(result);

    expect(await parcelRepository.findAll(query)).toStrictEqual([
      {
        country: 'Estonia',
        deliveryDate: new Date('2024-03-17T12:11:19.769Z'),
        description: 'A parcel',
        stockKeepingUnit: 'SKU',
        street: '123 Main St',
        town: 'Townsville',
        trackingId: '123',
      },
    ]);
    expect(parcelEntityRepository.find).toHaveBeenCalledWith({
      where: {},
      order: {
        deliveryDate: 'ASC',
      },
    });
  });

  it('should find all parcels, estonian ones first', async () => {
    const query: QueryParcelCommand = {
      stockKeepingUnit: 'SKU',
    };
    const estoniaResults: ParcelEntity[] = [
      {
        id: 1,
        trackingId: '123',
        stockKeepingUnit: 'SKU',
        description: 'A parcel',
        deliveryDate: new Date('2024-03-17T12:11:19.769Z'),
        street: '123 Main St',
        town: 'Townsville',
        country: 'Estonia',
      },
    ];
    const otherResults: ParcelEntity[] = [
      {
        id: 1,
        trackingId: '123',
        stockKeepingUnit: 'SKU',
        description: 'A parcel',
        deliveryDate: new Date('2024-03-17T12:11:19.769Z'),
        street: '123 Main St',
        town: 'Townsville',
        country: 'Spain',
      },
    ];

    // @ts-ignore
    jest
      .spyOn(parcelEntityRepository, 'find')
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(estoniaResults) as any),
      )
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(otherResults) as any),
      );

    expect(
      await parcelRepository.findAllOrderEstoniaFirst(query),
    ).toStrictEqual([
      {
        trackingId: '123',
        stockKeepingUnit: 'SKU',
        description: 'A parcel',
        deliveryDate: new Date('2024-03-17T12:11:19.769Z'),
        street: '123 Main St',
        town: 'Townsville',
        country: 'Estonia',
      },
      {
        trackingId: '123',
        stockKeepingUnit: 'SKU',
        description: 'A parcel',
        deliveryDate: new Date('2024-03-17T12:11:19.769Z'),
        street: '123 Main St',
        town: 'Townsville',
        country: 'Spain',
      },
    ]);
    expect(parcelEntityRepository.find).toHaveBeenCalledWith({
      where: {
        country: 'Estonia',
        stockKeepingUnit: 'SKU',
      },
      order: {
        deliveryDate: 'ASC',
      },
    });

    expect(parcelEntityRepository.find).toHaveBeenCalledWith({
      where: {
        country: Not('Estonia'),
        stockKeepingUnit: 'SKU',
      },
      order: {
        deliveryDate: 'ASC',
      },
    });
  });

  it('should save a parcel', () => {
    const parcel: Parcel = {
      trackingId: '123',
      stockKeepingUnit: 'SKU',
      description: 'A parcel',
      deliveryDate: new Date(),
      street: '123 Main St',
      town: 'Townsville',
      country: 'Estonia',
    };
    // @ts-ignore
    jest.spyOn(parcelEntityRepository, 'save').mockReturnValue(parcel);

    expect(parcelRepository.save(parcel)).resolves.toStrictEqual({
      trackingId: '123',
      stockKeepingUnit: 'SKU',
      description: 'A parcel',
      deliveryDate: new Date(),
      street: '123 Main St',
      town: 'Townsville',
      country: 'Estonia',
    });
    expect(parcelEntityRepository.save).toHaveBeenCalledWith(
      parcelRepositoryMapper.mapToEntity(parcel),
    );
  });
});
