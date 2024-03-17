import { Injectable } from '@nestjs/common';
import { ParcelEntity } from '../model/parcel.entity';
import { Parcel } from '../../domain/model/parcel.model';

@Injectable()
export class ParcelRepositoryMapper {
  mapToDomain(parcelEntity: ParcelEntity): Parcel {
    return {
      trackingId: parcelEntity.trackingId as string,
      stockKeepingUnit: parcelEntity.stockKeepingUnit,
      description: parcelEntity.description,
      deliveryDate: parcelEntity.deliveryDate,
      street: parcelEntity.street,
      town: parcelEntity.town,
      country: parcelEntity.country,
    };
  }

  mapToEntity(parcel: Parcel): ParcelEntity {
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
