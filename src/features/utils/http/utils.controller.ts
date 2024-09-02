import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { resolveSvcFn } from '../../../common/utils';
import { DocErrorResp } from '../../../common/docs/index';
import { UtilsService } from '../services/utils.service';
import { GetPaymentPairsResp } from '../docs/get-payment-pairs.docs';

@ApiResponse(DocErrorResp.example)
@ApiTags('Utils')
@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @HttpCode(200)
  @ApiOkResponse(GetPaymentPairsResp.example)
  @Get('/payment-pairs')
  async getPaymentPairs() {
    return resolveSvcFn(
      this.utilsService.getPaymentPairs(),
      'job payment pairs fetched successfully.',
    );
  }
}
