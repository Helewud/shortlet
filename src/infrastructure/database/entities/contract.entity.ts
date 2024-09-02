import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { ContractStatus } from '../../../common/enum';

@Entity({ name: 'contracts' })
export class ContractEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text' })
  terms: string;

  @Column({ nullable: false, enum: ContractStatus })
  status: ContractStatus;

  @Column({ name: 'contractor_id', nullable: false, type: 'int' })
  contractor_id: number;

  @Column({ name: 'client_id', nullable: false, type: 'int' })
  client_id: number;

  @JoinColumn({ name: 'contractor_id', referencedColumnName: 'id' })
  @ManyToOne(() => ProfileEntity)
  contractor?: ProfileEntity;

  @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
  @ManyToOne(() => ProfileEntity)
  client?: ProfileEntity;
}
