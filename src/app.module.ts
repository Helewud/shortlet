import { Module, OnModuleInit } from '@nestjs/common';
import { validateEnv } from './common/env/env.vars';
import { DatabaseModule } from './infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    validateEnv();
  }
}
