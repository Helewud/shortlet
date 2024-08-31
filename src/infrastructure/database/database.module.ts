import { Global, Module } from '@nestjs/common';
import { typeormProvider } from '../../providers/typeorm.provider';
import { typeormEntitiesProvider } from '../../providers/typeorm.entities.provider';
import { ProfileRepository } from './repositories/profile.repository';
import { JobRepository } from './repositories/Job.repository';
import { ContractRepository } from './repositories/contract.repository';

const repositoryProviders = [
  ProfileRepository,
  ContractRepository,
  JobRepository,
];

@Global()
@Module({
  providers: [
    ...typeormProvider,
    ...typeormEntitiesProvider,
    ...repositoryProviders,
  ],
  exports: [
    ...typeormProvider,
    ...typeormEntitiesProvider,
    ...repositoryProviders,
  ],
})
export class DatabaseModule {}
