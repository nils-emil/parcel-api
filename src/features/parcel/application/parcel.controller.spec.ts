import { ParcelController } from './parcel.controller';
import { ParcelService } from '../domain/parcel.service';
import { ParcelMapper } from './mapper/parcel-mapper.service';
import { ParcelCommandMapper } from './mapper/parcel-create-command-mapper.service';
import { QueryParcelCommand } from '../domain/model/command/query-parcel.command';
import { ParcelCreateDto } from './model/parcel-create.dto.model';
import { ParcelTrackingService } from '../domain/parce-tracking.service';
import { ParcelRepository } from '../infrastructure/parcel.repository';

describe('ParcelController', () => {
  let parcelController: ParcelController;
  let parcelService: ParcelService;
  let parcelMapper: ParcelMapper;
  let parcelCreateMapper: ParcelCommandMapper;
  let parcelTrackingService: ParcelTrackingService;
  let parcelRepository: ParcelRepository;

  beforeEach(() => {
    parcelTrackingService = new ParcelTrackingService();
    parcelRepository = new ParcelRepository({} as any, {} as any);
    parcelService = new ParcelService(parcelTrackingService, parcelRepository);
    parcelMapper = new ParcelMapper();
    parcelCreateMapper = new ParcelCommandMapper();
    parcelController = new ParcelController(
      parcelService,
      parcelMapper,
      parcelCreateMapper,
    );
  });

  it('should get parcels if no country is set', async () => {
    const query: QueryParcelCommand = {} as QueryParcelCommand;

    const results = [
      {
        stockKeepingUnit: 'EEU12345',
        description: 'A parcel containing EE books',
        deliveryDate: new Date('2022-12-15T00:00:00.000Z'),
        street: '123 Main St',
        town: 'Townsville-spain',
        country: 'Estonia',
      },
    ];

    // @ts-ignore
    jest
      .spyOn(parcelRepository, 'findAllOrderEstoniaFirst')
      .mockResolvedValue(results);

    expect(await parcelController.getParcels(query)).toStrictEqual([
      {
        stockKeepingUnit: 'EEU12345',
        description: 'A parcel containing EE books',
        deliveryDate: new Date('2022-12-15T00:00:00.000Z'),
        street: '123 Main St',
        town: 'Townsville-spain',
        country: 'Estonia',
        trackingId: undefined,
      },
    ]);
  });

  it('should get parcels by country', async () => {
    const query: QueryParcelCommand = {
      country: 'Spain',
    } as QueryParcelCommand;

    const results = [
      {
        stockKeepingUnit: 'SPU12345',
        description: 'A parcel containing SP books',
        deliveryDate: new Date('2022-12-15T00:00:00.000Z'),
        street: '123 Main St',
        town: 'Townsville-spain',
        country: 'Spain',
      },
    ];

    // @ts-ignore
    jest.spyOn(parcelRepository, 'findAll').mockResolvedValue(results);

    expect(await parcelController.getParcels(query)).toStrictEqual([
      {
        stockKeepingUnit: 'SPU12345',
        description: 'A parcel containing SP books',
        deliveryDate: new Date('2022-12-15T00:00:00.000Z'),
        street: '123 Main St',
        town: 'Townsville-spain',
        country: 'Spain',
        trackingId: undefined,
      },
    ]);
  });

  it('should return empty array when service returns no parcels', async () => {
    const query: QueryParcelCommand = {} as QueryParcelCommand;

    // @ts-ignore
    jest.spyOn(parcelService, 'getParcels').mockResolvedValue([]);

    const result = await parcelController.getParcels(query);
    expect(result).toEqual([]);
  });

  it('should handle valid input for createParcel', () => {
    const parcelDto: ParcelCreateDto = {
      stockKeepingUnit: 'SKU12345',
      description: 'A parcel containing books',
      deliveryDate: '2022-12-31',
      street: '123 Main St',
      town: 'Townsville',
      country: 'Countryland',
    } as ParcelCreateDto;
    const result = {
      stockKeepingUnit: 'SKU12345',
      description: 'A parcel containing books',
      deliveryDate: '2022-12-31',
      street: '123 Main St',
      town: 'Townsville',
      country: 'Countryland',
      trackingId: 'xxx',
    };

    // @ts-ignore
    jest.spyOn(parcelService, 'createParcel').mockResolvedValue(result);
    // @ts-ignore
    jest.spyOn(parcelService, 'getValidationErrors').mockResolvedValue([]);

    expect(parcelController.createParcel(parcelDto)).resolves.toStrictEqual(
      result,
    );
  });

  it('should handle validation error for createParcel', () => {
    const parcelDto: ParcelCreateDto = {
      stockKeepingUnit: 'SKU12345',
      description: 'A parcel containing books',
      deliveryDate: '2022-12-31',
      street: '123 Main St',
      town: 'Townsville',
      country: 'Countryland',
    } as ParcelCreateDto;

    // @ts-ignore
    jest
      .spyOn(parcelService, 'getValidationErrors')
      .mockResolvedValue(['stockKeepingUnit value already exists']);

    expect(parcelController.createParcel(parcelDto)).rejects.toThrow();
  });
});
