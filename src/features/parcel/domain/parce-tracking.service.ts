import { Injectable } from '@nestjs/common';

@Injectable()
export class ParcelTrackingService {
  getNewTrackingId(): string {
    return Math.random().toString(16).slice(2).toUpperCase();
  }
}
