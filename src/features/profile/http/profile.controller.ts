import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { resolveSvcFn } from '../../../common/utils';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiIdHeader } from '../../../common/decorators/api-id-header.decorator';
import { ProfileService } from '../services/profile.service';
import { DocErrorResp } from '../../../common/docs';
import { GetUnpaidJobsResp } from '../docs/get-unpaid-jobs.docs';
import {
  IncrementBalanceDto,
  IncrementBalanceParamDto,
} from '../dto/increment-balance.dto';

@UseGuards(AuthGuard)
@ApiIdHeader()
@ApiResponse(DocErrorResp.example)
@ApiTags('Profile')
@Controller('')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @HttpCode(200)
  @ApiOkResponse(GetUnpaidJobsResp.example)
  @Post('/balances/deposit/:userId')
  async incrementBalance(
    @Body() body: IncrementBalanceDto,
    @Param() param: IncrementBalanceParamDto,
  ) {
    return resolveSvcFn(
      this.profileService.incrementBalance({
        ...body,
        ...param,
      }),
      'balance incremented successfully.',
    );
  }
}
