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
import { ParcelCommandMapper } from './mapper/parcel-create-command-mapper.service';
import { QueryParcelCommand } from '../domain/model/command/query-parcel.command';
import { Parcel } from '../domain/model/parcel.model';
import { ParcelQueryDto } from './model/parcel-query-dto.model';

@Controller()
export class ParcelController {
  constructor(
    private readonly parcelService: ParcelService,
    private readonly parcelMapper: ParcelMapper,
    private readonly parcelCreateMapper: ParcelCommandMapper,
  ) {}

  @Get('/parcels')
  async getParcels(@Query() query: ParcelQueryDto): Promise<ParcelDto[]> {
    const createCommand: QueryParcelCommand =
      this.parcelCreateMapper.mapToQueryCommand(query);
    const parcels: Parcel[] =
      await this.parcelService.getParcels(createCommand);
    return parcels.map((parcel) => this.parcelMapper.mapToDto(parcel));
  }

  @Post('/parcel')
  async createParcel(@Body() parcelDto: ParcelCreateDto) {
    const createCommand = this.parcelCreateMapper.mapToCreateCommand(parcelDto);
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
