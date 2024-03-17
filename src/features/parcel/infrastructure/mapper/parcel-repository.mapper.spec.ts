import { ParcelRepositoryMapper } from './parcel-repository.mapper';
import { ParcelEntity } from '../model/parcel.entity';
import { Parcel } from '../../domain/model/parcel.model';

describe('ParcelRepositoryMapper', () => {
  let mapper: ParcelRepositoryMapper;

  beforeEach(() => {
    mapper = new ParcelRepositoryMapper();
  });

  it('should map ParcelEntity to Parcel', () => {
    const parcelEntity: ParcelEntity = {
      trackingId: 'TR12345',
      stockKeepingUnit: 'SKU12345',
      description: 'A parcel containing books',
      deliveryDate: new Date('2022-12-31T00:00:00.000Z'),
      street: '123 Main St',
      town: 'Townsville',
      country: 'Countryland',
    };

    const parcel = mapper.mapToDomain(parcelEntity);

    expect(parcel).toEqual({
      trackingId: 'TR12345',
      stockKeepingUnit: 'SKU12345',
      description: 'A parcel containing books',
      deliveryDate: new Date('2022-12-31T00:00:00.000Z'),
      street: '123 Main St',
      town: 'Townsville',
      country: 'Countryland',
    });
  });

  it('should map Parcel to ParcelEntity', () => {
    const parcel: Parcel = {
      trackingId: 'TR12345',
      stockKeepingUnit: 'SKU12345',
      description: 'A parcel containing books',
      deliveryDate: new Date('2022-12-31T00:00:00.000Z'),
      street: '123 Main St',
      town: 'Townsville',
      country: 'Countryland',
    };

    const parcelEntity = mapper.mapToEntity(parcel);

    expect(parcelEntity).toEqual({
      trackingId: 'TR12345',
      stockKeepingUnit: 'SKU12345',
      description: 'A parcel containing books',
      deliveryDate: new Date('2022-12-31T00:00:00.000Z'),
      street: '123 Main St',
      town: 'Townsville',
      country: 'Countryland',
    });
  });
});
