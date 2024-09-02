import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  uuid: string;

  @Column({ name: 'created_at', nullable: false, type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_at', nullable: false, type: 'timestamp' })
  updatedAt: Date;
}
