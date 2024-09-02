import {
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { ProfileEntity } from '../../../infrastructure/database/entities/profile.entity';
import { SessionProfile } from '../../../common/decorators/session.decorator';
import { resolveSvcFn } from '../../../common/utils';
import { MakeJobPaymentDto } from '../dto/make-job-payment.dto';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { ApiIdHeader } from '../../../common/decorators/api-id-header.decorator';
import { JobService } from '../services/job.service';
import { DocErrorResp } from '../../../common/docs';
import { GetUnpaidJobsResp } from '../docs/get-unpaid-jobs.docs';
import { MakeJobPaymentResp } from '../docs/make-job-payment.doc';
import { ContractStatus } from '../../../common/enum';

@UseGuards(AuthGuard)
@ApiIdHeader()
@ApiResponse(DocErrorResp.example)
@ApiTags('Jobs')
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @HttpCode(200)
  @ApiOkResponse(GetUnpaidJobsResp.example)
  @Get('/unpaid')
  async getActiveUnpaidJobs(@SessionProfile() profile: ProfileEntity) {
    return resolveSvcFn(
      this.jobService.getJobs({
        profileId: profile.id,
        paymentStatus: 'unpaid',
        contractStatus: ContractStatus.IN_PROGRESS,
      }),
      'jobs fetched successfully.',
    );
  }

  @HttpCode(201)
  @ApiOkResponse(MakeJobPaymentResp.example)
  @Post('/:job_id/pay')
  async makeJobPayment(
    @SessionProfile() profile: ProfileEntity,
    @Param() param: MakeJobPaymentDto,
  ) {
    return resolveSvcFn(
      this.jobService.makeJobPayment({
        profileId: profile.id,
        profileBalance: profile.balance,
        jobId: param.job_id,
      }),
      'job payment processed successfully.',
    );
  }
}
