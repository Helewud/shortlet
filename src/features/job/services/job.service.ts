import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JobRepository } from '../../../infrastructure/database/repositories/job.repository';
import { ProfileRepository } from '../../../infrastructure/database/repositories/profile.repository';
import { ContractStatus } from '../../../common/enum';

@Injectable()
export class JobService {
  constructor(
    private readonly profileRepository: ProfileRepository,
    private readonly jobRepository: JobRepository,
  ) {}

  async getJobs(dto: {
    profileId: number;
    paymentStatus: 'paid' | 'unpaid';
    contractStatus: ContractStatus;
  }) {
    return this.jobRepository.findJobsByProfileId(dto.profileId, {
      paymentStatus: dto.paymentStatus,
      contractStatus: dto.contractStatus,
    });
  }

  async makeJobPayment(dto: {
    profileId: number;
    profileBalance: number;
    jobId: number;
  }) {
    const tx = await this.jobRepository.startTransaction();

    const job = await this.jobRepository.findJobByProfileId(
      {
        profileId: dto.profileId,
        jobId: dto.jobId,
        paymentStatus: 'unpaid',
      },
      tx,
    );

    if (!job) {
      return new NotFoundException('job not found');
    }

    if (job.is_paid) {
      return new BadRequestException('job already paid');
    }

    if (job.contract.status !== ContractStatus.IN_PROGRESS) {
      return new BadRequestException(
        'only jobs that the contract is in progress can be paid for!',
      );
    }

    const canPay = this.canMakePayment(dto.profileBalance, job.price);
    if (canPay instanceof Error) {
      return canPay;
    }

    const updateData = {
      is_paid: true,
      paid_date: new Date().toISOString(),
    };

    await Promise.all([
      this.profileRepository.incrementBalance(
        { id: job.contract.client_id },
        -Number(job.price),
        tx,
      ),

      this.profileRepository.incrementBalance(
        { id: job.contract.contractor_id },
        Number(job.price),
        tx,
      ),

      this.jobRepository.updateOne({ id: job.id }, updateData, tx),
    ]);

    await this.jobRepository.commitTransaction(tx);

    return { ...job, ...updateData };
  }

  private canMakePayment(currentBalance: number, payment: number) {
    currentBalance = Number(currentBalance);
    payment = Number(payment);

    if (currentBalance < 0) {
      return new BadRequestException(
        'user current balance cannot be in negative form.',
      );
    }

    if (payment < 0) {
      return new BadRequestException('payment cannot be in negative form.');
    }

    if (currentBalance < payment) {
      return new BadRequestException('insufficient balance!');
    }

    return true;
  }
}
