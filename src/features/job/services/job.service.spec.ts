import { faker } from '@faker-js/faker';
import { createMock } from '@golevelup/ts-jest';
import { ProfileRepository } from '../../../infrastructure/database/repositories/profile.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JobRepository } from '../../../infrastructure/database/repositories/job.repository';
import { JobService } from './job.service';
import FactoryModel from '../../../common/factories/builder';
import { ContractStatus } from '../../../common/enum';

describe('JobService', () => {
  let profileRepository: ProfileRepository;
  let jobRepository: JobRepository;
  let jobService: JobService;

  beforeEach(async () => {
    profileRepository = createMock<ProfileRepository>();
    jobRepository = createMock<JobRepository>();
    jobService = new JobService(profileRepository, jobRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('canMakePayment', () => {
    it('should return error if currentBalance is less than zero', () => {
      const currentBalance = -faker.finance.amount({ min: 5000, max: 70000 });

      const result = jobService['canMakePayment'](currentBalance, 2000);

      expect(result).toBeInstanceOf(BadRequestException);
      expect(result).toBeInstanceOf(Error);
    });

    it('should return error if payment is less than zero', () => {
      const currentBalance = -faker.finance.amount({ min: 5000, max: 70000 });

      const result = jobService['canMakePayment'](2000, currentBalance);

      expect(result).toBeInstanceOf(BadRequestException);
      expect(result).toBeInstanceOf(Error);
    });

    it('should return error if currentBalance is less then payment', () => {
      const currentBalance = +faker.finance.amount({ min: 5000, max: 70000 });
      const payment = currentBalance + 2000;

      const result = jobService['canMakePayment'](currentBalance, payment);

      expect(result).toBeInstanceOf(BadRequestException);
      expect(result).toBeInstanceOf(Error);
    });

    it('should return true because currentBalance is greater than payment', () => {
      const currentBalance = +faker.finance.amount({ min: 5000, max: 70000 });
      const payment = currentBalance - 2000;

      const result = jobService['canMakePayment'](currentBalance, payment);

      expect(result).toBe(true);
    });
  });

  describe('getJobs', () => {
    it('should invoke all neccessary dependencies and return the response.', async () => {
      const jobs = [FactoryModel.Job()];

      const findJobsByProfileIdSpy = jest
        .spyOn(jobRepository, 'findJobsByProfileId')
        .mockResolvedValue(jobs);

      const result = await jobService.getJobs({
        profileId: 1,
        paymentStatus: 'paid',
        contractStatus: ContractStatus.IN_PROGRESS,
      });

      expect(findJobsByProfileIdSpy).toHaveBeenCalled();
      expect(result).toEqual(expect.arrayContaining(result));
    });
  });

  describe('incrementBalance', () => {
    it('should return error if no job is found.', async () => {
      // Spies
      const findJobByProfileIdSpy = jest
        .spyOn(jobRepository, 'findJobByProfileId')
        .mockResolvedValue(null);

      const result = await jobService.makeJobPayment({
        profileId: 1,
        profileBalance: 100,
        jobId: 2,
      });

      expect(findJobByProfileIdSpy).toHaveBeenCalled();
      expect(result).toBeInstanceOf(NotFoundException);
      expect(result).toBeInstanceOf(Error);
    });

    it('should return error if job is already paid.', async () => {
      const job = FactoryModel.Job({ is_paid: true });

      // Spies
      const findJobByProfileIdSpy = jest
        .spyOn(jobRepository, 'findJobByProfileId')
        .mockResolvedValue(job);

      const result = await jobService.makeJobPayment({
        profileId: 1,
        profileBalance: 100,
        jobId: 2,
      });

      expect(findJobByProfileIdSpy).toHaveBeenCalled();
      expect(result).toBeInstanceOf(BadRequestException);
      expect(result).toBeInstanceOf(Error);
    });

    it('should return error if profile balance is less than job price.', async () => {
      const price = +faker.finance.amount({ min: 5000, max: 70000 });

      const job = FactoryModel.Job({
        price,
        contract: FactoryModel.Contract({ status: ContractStatus.IN_PROGRESS }),
      });

      // Spies
      const findJobByProfileIdSpy = jest
        .spyOn(jobRepository, 'findJobByProfileId')
        .mockResolvedValue(job);

      const result = await jobService.makeJobPayment({
        profileId: 1,
        profileBalance: price - 1000,
        jobId: 2,
      });

      expect(findJobByProfileIdSpy).toHaveBeenCalled();
      expect(result).toBeInstanceOf(BadRequestException);
      expect(result).toBeInstanceOf(Error);
    });

    it('should return updated job because payment was successful.', async () => {
      const price = +faker.finance.amount({ min: 5000, max: 70000 });

      const job = FactoryModel.Job({
        price,
        contract: FactoryModel.Contract({ status: ContractStatus.IN_PROGRESS }),
      });

      // Spies
      const startTransactionSpy = jest.spyOn(jobRepository, 'startTransaction');

      const commitTransaction = jest.spyOn(jobRepository, 'commitTransaction');

      const findJobByProfileIdSpy = jest
        .spyOn(jobRepository, 'findJobByProfileId')
        .mockResolvedValue(job);

      const incrementBalanceSpy = jest.spyOn(
        profileRepository,
        'incrementBalance',
      );

      const updateOneSpy = jest.spyOn(jobRepository, 'updateOne');

      const result = await jobService.makeJobPayment({
        profileId: 1,
        profileBalance: price + 1000,
        jobId: 2,
      });

      expect(startTransactionSpy).toHaveBeenCalled();
      expect(findJobByProfileIdSpy).toHaveBeenCalled();
      expect(incrementBalanceSpy).toHaveBeenCalledTimes(2);
      expect(updateOneSpy).toHaveBeenCalled();
      expect(commitTransaction).toHaveBeenCalled();

      expect(result).toMatchObject(
        expect.objectContaining({
          id: expect.any(Number),
          uuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),

          description: expect.any(String),
          price: expect.any(Number),
          is_paid: true,
          paid_date: expect.any(String),
          contract_id: expect.any(Number),
        }),
      );
    });
  });
});
