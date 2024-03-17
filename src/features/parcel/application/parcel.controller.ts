import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ParcelService } from '../domain/parcel.service';
import { ParcelCreateDto } from './model/parcel-create.dto.model';
import { ParcelDto } from './model/parcel-dto.model';
import { ParcelMapper } from './mapper/parcel-mapper.service';
import { ParcelCreateCommandMapper } from './mapper/parcel-create-command-mapper.service';
import { QueryParcelCommand } from '../domain/model/command/query-parcel.command';
import { Parcel } from '../domain/model/parcel.model';

@Controller()
export class ParcelController {
  constructor(
    private readonly parcelService: ParcelService,
    private readonly parcelMapper: ParcelMapper,
    private readonly parcelCreateMapper: ParcelCreateCommandMapper,
  ) {}

  @Get('/parcels')
  async getParcels(@Query() query: QueryParcelCommand): Promise<ParcelDto[]> {
    const parcels: Parcel[] = await this.parcelService.getParcels(query);
    return parcels.map((parcel) => this.parcelMapper.mapToDto(parcel));
  }

  @Post('/parcel')
  async createParcel(@Body() parcelDto: ParcelCreateDto) {
    const createCommand = this.parcelCreateMapper.mapToCommand(parcelDto);
    const validationErrors: string[] =
      await this.parcelService.getValidationErrors(createCommand);
    if (validationErrors.length) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: validationErrors,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: 'error',
        },
      );
    }
    return this.parcelService.createParcel(createCommand);
  }
}
