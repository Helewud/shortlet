import { Controller, Get, HttpCode, Param, UseGuards } from '@nestjs/common';
import { ContractService } from '../services/contract.service';
import { ApiTags, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { ProfileEntity } from '../../../infrastructure/database/entities/profile.entity';
import { SessionProfile } from '../../../common/decorators/session.decorator';
import { ContractStatus } from '../../../common/enum';
import { resolveSvcFn } from '../../../common/utils';
import { GetContractDto } from '../dto/get-contract.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiIdHeader } from '../../../common/decorators/api-id-header.decorator';
import { DocErrorResp } from '../../../common/docs/index';
import { GetContractResp } from '../docs/get-contract.docs';
import { GetActiveContractsResp } from '../docs/get-active-contracts.doc';

@UseGuards(AuthGuard)
@ApiIdHeader()
@ApiResponse(DocErrorResp.example)
@ApiTags('Contracts')
@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @HttpCode(200)
  @ApiOkResponse(GetContractResp.example)
  @Get('/:id')
  async getContract(
    @SessionProfile() profile: ProfileEntity,
    @Param() param: GetContractDto,
  ) {
    return resolveSvcFn(
      this.contractService.getContract({
        profileId: profile.id,
        contractId: param.id,
      }),
      'contract fetched successfully.',
    );
  }

  @HttpCode(200)
  @ApiOkResponse(GetActiveContractsResp.example)
  @Get('/')
  async getActiveContracts(@SessionProfile() profile: ProfileEntity) {
    return resolveSvcFn(
      this.contractService.getManyContracts({
        profileId: profile.id,
        status: ContractStatus.IN_PROGRESS,
      }),
      'active contracts fetched successfully.',
    );
  }
}
