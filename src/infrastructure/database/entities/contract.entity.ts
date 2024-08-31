import { ContractStatus } from '../../../common/enum';
import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ProfileEntity } from './profile.entity';

@Entity({ name: 'contracts' })
export class ContractEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text' })
  terms: string;

  @Column({ nullable: false, enum: ContractStatus })
  status: ContractStatus;

  @Column({ nullable: false, type: 'int' })
  contrator_id: number;

  @Column({ nullable: false, type: 'int' })
  client_id: string;

  @JoinColumn({ name: 'contrator_id', referencedColumnName: 'id' })
  @ManyToOne(() => ProfileEntity)
  contractor?: ProfileEntity;

  @JoinColumn({ name: 'client_id', referencedColumnName: 'id' })
  @ManyToOne(() => ProfileEntity)
  client?: ProfileEntity;
}
