import { Module, OnModuleInit } from '@nestjs/common';
import { validateEnv } from './common/env/env.vars';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ContractModule } from './features/contract/user.module';
import { JobModule } from './features/job/job.module';
import { ProfileModule } from './features/profile/profile.module';
import { AdminModule } from './features/admin/admin.module';
import { UtilsModule } from './features/utils/utils.module';

@Module({
  imports: [
    DatabaseModule,
    JobModule,
    ProfileModule,
    ContractModule,
    AdminModule,
    UtilsModule,
  ],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    validateEnv();
  }
}
