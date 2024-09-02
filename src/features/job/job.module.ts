import { Module } from '@nestjs/common';
import { JobController } from './http/job.controller';
import { JobService } from './services/job.service';

@Module({
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
