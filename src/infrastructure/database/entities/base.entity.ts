import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'uuid', nullable: false })
  uuid: string;

  @Column({ nullable: false, type: 'timestamp' })
  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: false, type: 'timestamp' })
  @UpdateDateColumn()
  updated_at: Date;
}
