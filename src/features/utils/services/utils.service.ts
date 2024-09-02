import { Injectable } from '@nestjs/common';
import { JobRepository } from '../../../infrastructure/database/repositories/job.repository';

@Injectable()
export class UtilsService {
  constructor(private readonly jobRepository: JobRepository) {}

  async getPaymentPairs() {
    return this.jobRepository.getPaymentPairs();
  }
}
