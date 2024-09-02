import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ProfileRoles } from '../../../common/enum';

@Entity({ name: 'profiles' })
export class ProfileEntity extends BaseEntity {
  @Column({ nullable: false, type: 'varchar' })
  uuid: string;

  @Column({ name: 'first_name', nullable: false, type: 'varchar' })
  first_name: string;

  @Column({ name: 'last_name', nullable: false, type: 'varchar' })
  last_name: string;

  @Column({ nullable: false, type: 'varchar' })
  profession: string;

  @Column({ nullable: true, type: 'decimal' })
  balance?: number;

  @Column({ nullable: false, enum: ProfileRoles })
  role: ProfileRoles;
}
