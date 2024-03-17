import { ParcelCreateDto } from '../model/parcel-create.dto.model';
import { ParcelCommandMapper } from './parcel-create-command-mapper.service';
import { ParcelQueryDto } from '../model/parcel-query-dto.model';

describe('ParcelCreateCommandMapper', () => {
  let mapper: ParcelCommandMapper;

  beforeEach(() => {
    mapper = new ParcelCommandMapper();
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

    const command = mapper.mapToCreateCommand(dto);

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

  it('should map ParcelQueryDto to QueryParcelCommand', () => {
    const dto: ParcelQueryDto = {
      description: 'A parcel containing books',
      country: 'Countryland',
    };

    const command = mapper.mapToQueryCommand(dto);

    expect(command).toEqual({
      description: 'A parcel containing books',
      country: 'Countryland',
    });
  });
});
