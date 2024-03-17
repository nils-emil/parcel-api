import { Injectable } from '@nestjs/common';
import { ParcelRepository } from '../infrastructure/parcel.repository';
import { ParcelTrackingService } from './parce-tracking.service';
import { QueryParcelCommand } from './model/command/query-parcel.command';
import { CreateParcelCommand } from './model/command/create-parcel.command';
import { Parcel } from './model/parcel.model';

@Injectable()
export class ParcelService {
  constructor(
    private readonly parcelTrackingService: ParcelTrackingService,
    private readonly parcelRepository: ParcelRepository,
  ) {}

  getParcels(query: QueryParcelCommand): Promise<Parcel[]> {
    if (query.country) {
      return this.parcelRepository.findAll(query);
    }
    return this.parcelRepository.findAllOrderEstoniaFirst(query);
  }

  async createParcel(createCommand: CreateParcelCommand): Promise<Parcel> {
    const trackingId = this.parcelTrackingService.getNewTrackingId();
    const parcel = { ...createCommand.parcel, trackingId } as Parcel;
    return this.parcelRepository.save(parcel);
  }

  async getValidationErrors(
    createCommand: CreateParcelCommand,
  ): Promise<string[]> {
    const existingParcelsWithSameSku = await this.parcelRepository.findAll({
      stockKeepingUnit: createCommand.parcel.stockKeepingUnit,
    });
    if (existingParcelsWithSameSku.length) {
      return ['stockKeepingUnit value already exists'];
    }
    return [];
  }
}
