import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ContractEntity } from './contract.entity';

@Entity({ name: 'jobs' })
export class JobEntity extends BaseEntity {
  @Column({ nullable: false, type: 'text' })
  description: string;

  @Column({ nullable: false, type: 'decimal' })
  price: number;

  @Column({ nullable: false })
  is_paid: boolean;

  @Column({ nullable: true, type: 'date' })
  paid_date?: string;

  @Column({ nullable: false, type: 'int' })
  contrat_id: number;

  @JoinColumn({ name: 'contrat_id', referencedColumnName: 'id' })
  @ManyToOne(() => ContractEntity)
  contract?: ContractEntity;
}
