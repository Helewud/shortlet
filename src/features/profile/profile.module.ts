import { Module } from '@nestjs/common';
import { ProfileController } from './http/profile.controller';
import { ProfileService } from './services/profile.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
