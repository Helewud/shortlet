import { faker } from '@faker-js/faker';
import { createMock } from '@golevelup/ts-jest';
import { ProfileService } from './profile.service';
import { ProfileRepository } from '../../../infrastructure/database/repositories/profile.repository';
import { BadRequestException } from '@nestjs/common';

describe('ProfileService', () => {
  let profileRepository: ProfileRepository;
  let profileService: ProfileService;

  beforeEach(async () => {
    profileRepository = createMock<ProfileRepository>();
    profileService = new ProfileService(profileRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getThresholdAmount', () => {
    it('should return a number type', () => {
      const result = profileService['getThresholdAmount'](1000);
      expect(result).toEqual(expect.any(Number));
    });

    it('should return a number type if input is null', () => {
      const result = profileService['getThresholdAmount'](null);
      expect(result).toEqual(expect.any(Number));
    });

    it('should return 25% of the input value', () => {
      const input = +faker.finance.amount({ min: 5000, max: 70000 });

      const result = profileService['getThresholdAmount'](input);

      expect(result).toEqual(input * 0.25);
    });
  });

  describe('canIncrementBalance', () => {
    it('should return error if amount is greater than 25% of outstanding balance', () => {
      const result = profileService['canIncrementBalance'](1000, 2000);

      expect(result).toBeInstanceOf(BadRequestException);
      expect(result).toBeInstanceOf(Error);
    });

    it('should return true if amount is lesser than 25% of outstanding balance', () => {
      const result = profileService['canIncrementBalance'](400, 2000);

      expect(result).toBe(true);
    });
  });

  describe('incrementBalance', () => {
    it('should invoke all neccessary dependencies.', async () => {
      const ledger = {
        settled_balance: faker.finance.amount({ min: 5000, max: 70000 }),
        outstanding_balance: faker.finance.amount({ min: 5000, max: 70000 }),
      };
      // Spies
      const getLedgerBalanceByIdSpy = jest
        .spyOn(profileRepository, 'getLedgerBalanceById')
        .mockResolvedValue(ledger);

      const incrementBalanceSpy = jest.spyOn(
        profileService,
        'incrementBalance',
      );

      const startTransactionSpy = jest.spyOn(
        profileRepository,
        'startTransaction',
      );

      const commitTransactionSpy = jest.spyOn(
        profileRepository,
        'commitTransaction',
      );

      await profileService.incrementBalance({
        amount: 1000,
        userId: 1,
      });

      expect(getLedgerBalanceByIdSpy).toHaveBeenCalled();
      expect(incrementBalanceSpy).toHaveBeenCalled();
      expect(startTransactionSpy).toHaveBeenCalled();
      expect(commitTransactionSpy).toHaveBeenCalled();
    });

    it('should return error because deposit amount is greater than 25% of outstanding balance', async () => {
      const ledger = {
        settled_balance: faker.finance.amount({ min: 5000, max: 70000 }),
        outstanding_balance: faker.finance.amount({ min: 5000, max: 70000 }),
      };

      // Spies
      jest
        .spyOn(profileRepository, 'getLedgerBalanceById')
        .mockResolvedValue(ledger);

      const result = await profileService.incrementBalance({
        amount: +ledger.outstanding_balance * 0.25 + 500,
        userId: 1,
      });

      expect(result).toBeInstanceOf(BadRequestException);
      expect(result).toBeInstanceOf(Error);
    });

    it('should return true because increment was successful', async () => {
      const ledger = {
        settled_balance: faker.finance.amount({ min: 5000, max: 70000 }),
        outstanding_balance: faker.finance.amount({ min: 5000, max: 70000 }),
      };

      // Spies
      jest
        .spyOn(profileRepository, 'getLedgerBalanceById')
        .mockResolvedValue(ledger);

      const result = await profileService.incrementBalance({
        amount: +ledger.outstanding_balance * 0.25 - 500,
        userId: 1,
      });

      expect(result).toBe(true);
    });
  });
});
