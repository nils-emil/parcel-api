import { Injectable } from '@nestjs/common';
import { ParcelCreateDto } from '../model/parcel-create.dto.model';
import { CreateParcelCommand } from '../../domain/model/command/create-parcel.command';

@Injectable()
export class ParcelCreateCommandMapper {
  mapToCommand(parcelDto: ParcelCreateDto): CreateParcelCommand {
    return {
      parcel: {
        stockKeepingUnit: parcelDto.stockKeepingUnit,
        description: parcelDto.description,
        deliveryDate: new Date(parcelDto.deliveryDate),
        street: parcelDto.street,
        town: parcelDto.town,
        country: parcelDto.country,
      },
    };
  }
}
