import { Global, Module } from '@nestjs/common';
import { typeormProvider } from '../../providers/typeorm.provider';
import { typeormEntitiesProvider } from '../../providers/typeorm.entities.provider';
import { ProfileRepository } from './repositories/profile.repository';
import { JobRepository } from './repositories/job.repository';
import { ContractRepository } from './repositories/contract.repository';
import { SeederRepository } from './seeder/base.seeder';

const repositoryProviders = [
  ProfileRepository,
  ContractRepository,
  JobRepository,
];

@Global()
@Module({
  providers: [
    SeederRepository,

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
