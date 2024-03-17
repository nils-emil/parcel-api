import { ParcelMapper } from './parcel-mapper.service';
import { Parcel } from '../../domain/model/parcel.model';

describe('ParcelMapper', () => {
  let mapper: ParcelMapper;

  beforeEach(() => {
    mapper = new ParcelMapper();
  });

  it('should map Parcel to ParcelDto', () => {
    const parcel: Parcel = {
      trackingId: 'TR12345',
      stockKeepingUnit: 'SKU12345',
      description: 'A parcel containing books',
      deliveryDate: new Date('2022-12-31T00:00:00.000Z'),
      street: '123 Main St',
      town: 'Townsville',
      country: 'Countryland',
    };

    const dto = mapper.mapToDto(parcel);

    expect(dto).toEqual({
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
