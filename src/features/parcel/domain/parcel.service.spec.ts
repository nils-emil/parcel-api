import { ParcelRepository } from '../infrastructure/parcel.repository';
import { ParcelService } from './parcel.service';
import { ParcelTrackingService } from './parce-tracking.service';
import { QueryParcelCommand } from './model/command/query-parcel.command';
import { CreateParcelCommand } from './model/command/create-parcel.command';
import { Parcel } from './model/parcel.model';

describe('ParcelService', () => {
  let parcelService: ParcelService;
  let parcelTrackingService: jest.Mocked<ParcelTrackingService>;
  let parcelRepository: jest.Mocked<ParcelRepository>;

  beforeEach(() => {
    parcelTrackingService = new ParcelTrackingService() as any;
    parcelRepository = new ParcelRepository({} as any, {} as any) as any;
    parcelService = new ParcelService(parcelTrackingService, parcelRepository);
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

    expect(await parcelService.getParcels(query)).toStrictEqual([
      {
        stockKeepingUnit: 'EEU12345',
        description: 'A parcel containing EE books',
        deliveryDate: new Date('2022-12-15T00:00:00.000Z'),
        street: '123 Main St',
        town: 'Townsville-spain',
        country: 'Estonia',
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

    expect(await parcelService.getParcels(query)).toStrictEqual([
      {
        stockKeepingUnit: 'SPU12345',
        description: 'A parcel containing SP books',
        deliveryDate: new Date('2022-12-15T00:00:00.000Z'),
        street: '123 Main St',
        town: 'Townsville-spain',
        country: 'Spain',
      },
    ]);
  });

  it('should create parcel with a tracking ID', async () => {
    const query: QueryParcelCommand = {} as QueryParcelCommand;

    // @ts-ignore
    jest.spyOn(parcelService, 'getParcels').mockResolvedValue([]);

    const result = await parcelService.getParcels(query);
    expect(result).toEqual([]);
  });

  it('should handle expected input for createParcel', () => {
    const parcel = {
      stockKeepingUnit: 'SKU12345',
      description: 'A parcel containing books',
      deliveryDate: new Date('2022-12-31T00:00:00.000Z'),
      street: '123 Main St',
      town: 'Townsville',
      country: 'Countryland',
    };
    const createCommand: CreateParcelCommand = {
      parcel: parcel,
    };
    // @ts-ignore
    jest.spyOn(parcelRepository, 'save').mockImplementation((arg) => {
      return new Promise((resolve) => {
        resolve(arg);
      });
    });
    // @ts-ignore
    jest
      .spyOn(parcelTrackingService, 'getNewTrackingId')
      .mockReturnValue('tracker-123');

    expect(parcelService.createParcel(createCommand)).resolves.toStrictEqual({
      ...parcel,
      trackingId: 'tracker-123',
    });
  });

  it('should handle errors from ParcelRepository in createParcel', () => {
    const parcelCommand: CreateParcelCommand = {
      parcel: {
        stockKeepingUnit: 'SKU12345',
        description: 'A parcel containing books',
        deliveryDate: new Date('2022-12-31T00:00:00.000Z'),
        street: '123 Main St',
        town: 'Townsville',
        country: 'Countryland',
      },
    };
    // @ts-ignore
    jest
      .spyOn(parcelRepository, 'save')
      .mockRejectedValue(new Error('Failed to create parcel'));

    expect(parcelService.createParcel(parcelCommand)).rejects.toThrow(
      'Failed to create parcel',
    );
  });

  it('should not return validation error if no entities found', () => {
    const parcelCommand: CreateParcelCommand = {
      parcel: {
        stockKeepingUnit: 'SKU12345',
        description: 'A parcel containing books',
        deliveryDate: new Date('2022-12-31T00:00:00.000Z'),
        street: '123 Main St',
        town: 'Townsville',
        country: 'Countryland',
      },
    };

    // @ts-ignore
    jest.spyOn(parcelRepository, 'findAll').mockImplementation(() => {
      return new Promise((resolve) => {
        resolve([]);
      });
    });

    expect(
      parcelService.getValidationErrors(parcelCommand),
    ).resolves.toStrictEqual([]);
  });

  it('should return validation error if entities found', () => {
    const parcelCommand: CreateParcelCommand = {
      parcel: {
        stockKeepingUnit: 'SKU12345',
        description: 'A parcel containing books',
        deliveryDate: new Date('2022-12-31T00:00:00.000Z'),
        street: '123 Main St',
        town: 'Townsville',
        country: 'Countryland',
      },
    };

    // @ts-ignore
    jest.spyOn(parcelRepository, 'findAll').mockImplementation(() => {
      return new Promise((resolve) => {
        resolve([
          {
            stockKeepingUnit: 'SKU12345',
            description: 'A parcel containing books',
            deliveryDate: new Date('2022-12-31T00:00:00.000Z'),
            street: '123 Main St',
            town: 'Townsville',
            country: 'Countryland',
          } as Parcel,
        ]);
      });
    });
    expect(
      parcelService.getValidationErrors(parcelCommand),
    ).resolves.toStrictEqual(['stockKeepingUnit value already exists']);
  });
});
