import { FactoryProvider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProfileEntity } from '../infrastructure/database/entities/profile.entity';
import { ProviderTokens } from '../common/enum';
import { ContractEntity } from '../infrastructure/database/entities/contract.entity';
import { JobEntity } from '../infrastructure/database/entities/jobs.entity';

export const typeormEntitiesProvider: FactoryProvider[] = [
  {
    provide: ProfileEntity.name,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ProfileEntity),
    inject: [ProviderTokens.TYPEORM_DATA_SOURCE],
  },
  {
    provide: ContractEntity.name,
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ContractEntity),
    inject: [ProviderTokens.TYPEORM_DATA_SOURCE],
  },
  {
    provide: JobEntity.name,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(JobEntity),
    inject: [ProviderTokens.TYPEORM_DATA_SOURCE],
  },
];
