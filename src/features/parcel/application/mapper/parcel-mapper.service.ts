import { Injectable } from '@nestjs/common';
import { ParcelDto } from '../model/parcel-dto.model';
import { Parcel } from '../../domain/model/parcel.model';

@Injectable()
export class ParcelMapper {
  mapToDto(parcel: Parcel): ParcelDto {
    return {
      trackingId: parcel.trackingId as string,
      stockKeepingUnit: parcel.stockKeepingUnit,
      description: parcel.description,
      deliveryDate: parcel.deliveryDate,
      street: parcel.street,
      town: parcel.town,
      country: parcel.country,
    };
  }
}
