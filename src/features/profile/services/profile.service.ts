import { BadRequestException, Injectable } from '@nestjs/common';
import { ProfileRepository } from '../../../infrastructure/database/repositories/profile.repository';
import { IncrementBalanceDto } from '../dto/increment-balance.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async incrementBalance(dto: IncrementBalanceDto) {
    const tx = await this.profileRepository.startTransaction();

    const ledger = await this.profileRepository.getLedgerBalanceById(
      { profileId: dto.userId },
      tx,
    );

    const canIncrement = this.canIncrementBalance(
      Number(dto.amount),
      Number(ledger.outstanding_balance),
    );

    if (canIncrement instanceof Error) {
      return canIncrement;
    }

    await this.profileRepository.incrementBalance(
      { id: dto.userId },
      Number(dto.amount),
      tx,
    );

    await this.profileRepository.commitTransaction(tx);

    return true;
  }

  private getThresholdAmount(outstandingBalance: number) {
    return (25 / 100) * Number(outstandingBalance);
  }

  private canIncrementBalance(amount: number, outstandingBalance: number) {
    const thresholdAmount = this.getThresholdAmount(outstandingBalance);

    if (amount > thresholdAmount) {
      return new BadRequestException(
        'increment amount exceeds deposit limit for user!',
      );
    }

    return true;
  }
}
