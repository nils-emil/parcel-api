import { Injectable } from '@nestjs/common';
import { Like, Not, Repository } from 'typeorm';
import { QueryParcelCommand } from '../domain/model/command/query-parcel.command';
import { ParcelRepositoryMapper } from './mapper/parcel-repository.mapper';
import { ParcelEntity } from './model/parcel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { Parcel } from '../domain/model/parcel.model';

const ESTONIA = 'Estonia';

@Injectable()
export class ParcelRepository {
  constructor(
    private readonly parcelRepositoryMapper: ParcelRepositoryMapper,
    @InjectRepository(ParcelEntity as EntityClassOrSchema)
    private readonly parcelEntityRepository: Repository<ParcelEntity>,
  ) {}

  async findAll(query: QueryParcelCommand): Promise<Parcel[]> {
    let where = {};
    if (query.description) {
      where = { ...where, description: Like(`%${query.description}%`) };
    }
    if (query.country) {
      where = { ...where, country: query.country };
    }
    if (query.stockKeepingUnit) {
      where = { ...where, stockKeepingUnit: query.stockKeepingUnit };
    }
    const parcelEntities: ParcelEntity[] =
      await this.parcelEntityRepository.find({
        where: where,
        order: {
          deliveryDate: 'ASC',
        },
      });
    return parcelEntities.map((parcelEntity) =>
      this.parcelRepositoryMapper.mapToDomain(parcelEntity),
    );
  }

  async findAllOrderEstoniaFirst(query: QueryParcelCommand): Promise<Parcel[]> {
    let where = {};
    if (query.description) {
      where = { description: Like(`%${query.description}%`) };
    }
    if (query.stockKeepingUnit) {
      where = { ...where, stockKeepingUnit: query.stockKeepingUnit };
    }
    const deliveriesToEstonia: ParcelEntity[] =
      await this.parcelEntityRepository.find({
        where: {
          ...where,
          country: ESTONIA,
        },
        order: {
          deliveryDate: 'ASC',
        },
      });
    const otherDeliveries: ParcelEntity[] =
      await this.parcelEntityRepository.find({
        where: {
          ...where,
          country: Not(ESTONIA),
        },
        order: {
          deliveryDate: 'ASC',
        },
      });
    const deliveriesToEstoniaDomain: Parcel[] = deliveriesToEstonia.map(
      (parcelEntity) => this.parcelRepositoryMapper.mapToDomain(parcelEntity),
    );
    const otherDeliveriesDomain: Parcel[] = otherDeliveries.map(
      (parcelEntity) => this.parcelRepositoryMapper.mapToDomain(parcelEntity),
    );
    return deliveriesToEstoniaDomain.concat(otherDeliveriesDomain);
  }

  async save(parcel: Parcel): Promise<Parcel> {
    const parcelEntity: ParcelEntity =
      this.parcelRepositoryMapper.mapToEntity(parcel);
    const savedEntity = await this.parcelEntityRepository.save(parcelEntity);
    return this.parcelRepositoryMapper.mapToDomain(savedEntity);
  }
}
