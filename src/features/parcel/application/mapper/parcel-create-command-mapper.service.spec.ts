import { ParcelCreateDto } from '../model/parcel-create.dto.model';
import { ParcelCreateCommandMapper } from './parcel-create-command-mapper.service';

describe('ParcelCreateCommandMapper', () => {
  let mapper: ParcelCreateCommandMapper;

  beforeEach(() => {
    mapper = new ParcelCreateCommandMapper();
  });

  it('should map ParcelCreateDto to CreateParcelCommand', () => {
    const dto: ParcelCreateDto = {
      stockKeepingUnit: 'SKU12345',
      description: 'A parcel containing books',
      deliveryDate: '2022-12-31',
      street: '123 Main St',
      town: 'Townsville',
      country: 'Countryland',
    };

    const command = mapper.mapToCommand(dto);

    expect(command).toEqual({
      parcel: {
        stockKeepingUnit: 'SKU12345',
        description: 'A parcel containing books',
        deliveryDate: new Date('2022-12-31T00:00:00.000Z'),
        street: '123 Main St',
        town: 'Townsville',
        country: 'Countryland',
      },
    });
  });
});
