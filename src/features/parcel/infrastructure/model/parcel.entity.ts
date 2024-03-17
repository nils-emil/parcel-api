import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('parcel')
export class ParcelEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true, name: 'tracking_id' })
  trackingId: string;

  @Column({ name: 'stock_keeping_unit' })
  stockKeepingUnit: string;

  @Column()
  description: string;

  @Column({ type: 'date', name: 'delivery_date' })
  deliveryDate: Date;

  @Column()
  street: string;

  @Column()
  town: string;

  @Column()
  country: string;
}
