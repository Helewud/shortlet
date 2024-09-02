import { Module } from '@nestjs/common';
import { UtilsController } from './http/utils.controller';
import { UtilsService } from './services/utils.service';

@Module({
  controllers: [UtilsController],
  providers: [UtilsService],
})
export class UtilsModule {}
