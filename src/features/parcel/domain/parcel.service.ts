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
    return await this.parcelRepository.save(parcel);
  }

  async isStockKeepingUnitValid(stockKeepingUnit: string): Promise<boolean> {
    const existingParcelsWithSameSku = await this.parcelRepository.findAll({
      stockKeepingUnit,
    });
    return existingParcelsWithSameSku.length === 0;
  }

  async getValidationErrors(
    createCommand: CreateParcelCommand,
  ): Promise<string[]> {
    const isStockKeepingUnitValid = await this.isStockKeepingUnitValid(
      createCommand.parcel.stockKeepingUnit,
    );
    if (!isStockKeepingUnitValid) {
      return ['stockKeepingUnit value already exists'];
    }
    return [];
  }
}
