import { Injectable } from '@nestjs/common';
import { ParcelCreateDto } from '../model/parcel-create.dto.model';
import { CreateParcelCommand } from '../../domain/model/command/create-parcel.command';
import { ParcelQueryDto } from '../model/parcel-query-dto.model';
import { QueryParcelCommand } from '../../domain/model/command/query-parcel.command';

@Injectable()
export class ParcelCommandMapper {
  mapToQueryCommand(queryDto: ParcelQueryDto): QueryParcelCommand {
    return {
      country: queryDto.country,
      description: queryDto.description,
    };
  }

  mapToCreateCommand(parcelDto: ParcelCreateDto): CreateParcelCommand {
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
