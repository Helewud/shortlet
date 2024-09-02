import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ContractEntity } from './contract.entity';

@Entity({ name: 'jobs' })
export class JobEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text' })
  description: string;

  @Column({ nullable: false, type: 'decimal' })
  price: number;

  @Column({ name: 'is_paid', nullable: false })
  is_paid: boolean;

  @Column({ name: 'paid_date', nullable: true, type: 'date' })
  paid_date?: string;

  @Column({ name: 'contract_id', nullable: false, type: 'int' })
  contract_id: number;

  @JoinColumn({ name: 'contract_id', referencedColumnName: 'id' })
  @ManyToOne(() => ContractEntity)
  contract?: ContractEntity;
}
