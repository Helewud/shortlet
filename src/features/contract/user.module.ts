import { Module } from '@nestjs/common';
import { ContractController } from './http/contract.controller';
import { ContractService } from './services/contract.service';

@Module({
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
