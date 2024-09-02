import { faker } from '@faker-js/faker';
import { createMock } from '@golevelup/ts-jest';
import { ProfileRepository } from '../../../infrastructure/database/repositories/profile.repository';
import { AdminService } from './admin.service';
import FactoryModel from '../../../common/factories/builder';

describe('ContractService', () => {
  let profileRepository: ProfileRepository;
  let adminService: AdminService;

  beforeEach(async () => {
    profileRepository = createMock<ProfileRepository>();
    adminService = new AdminService(profileRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHighestGrossingProfession', () => {
    it('should invoke all neccessary dependencies and return a success response if date query is passed.', async () => {
      const profession = faker.person.jobType();

      const getHighestGrossingProfessionSpy = jest
        .spyOn(profileRepository, 'getHighestGrossingProfession')
        .mockResolvedValue(profession);

      const start = faker.date.future(1).toISOString();
      const end = faker.date.future(2).toISOString();

      const result = await adminService.getHighestGrossingProfession({
        start,
        end,
      });

      expect(getHighestGrossingProfessionSpy).toHaveBeenCalled();
      expect(getHighestGrossingProfessionSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: expect.stringMatching(start),
          endDate: expect.stringMatching(end),
        }),
      );
      expect(result).toEqual(expect.any(String));
      expect(result).toMatch(profession);
    });

    it('should invoke all neccessary dependencies and return a success response if date query is not passed.', async () => {
      const profession = faker.person.jobType();

      const getHighestGrossingProfessionSpy = jest
        .spyOn(profileRepository, 'getHighestGrossingProfession')
        .mockResolvedValue(profession);

      const result = await adminService.getHighestGrossingProfession({
        start: faker.date.future(1).toISOString(),
        end: faker.date.future(2).toISOString(),
      });

      expect(getHighestGrossingProfessionSpy).toHaveBeenCalled();
      expect(getHighestGrossingProfessionSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: expect.any(String),
          endDate: expect.any(String),
        }),
      );
      expect(result).toEqual(expect.any(String));
      expect(result).toMatch(profession);
    });
  });

  describe('getHighestGrossingClients', () => {
    it('should invoke all neccessary dependencies and return a success response if date and limit query is passed.', async () => {
      const clients = [
        FactoryModel.Profile({
          total_paid: faker.finance.amount({ min: 50000, max: 300000 }),
        }),
      ];

      const getHighestGrossingClientsSpy = jest
        .spyOn(profileRepository, 'getHighestGrossingClients')
        .mockResolvedValue(clients as any);

      const start = faker.date.future(1).toISOString();
      const end = faker.date.future(2).toISOString();
      const limit = 10;

      const result = await adminService.getHighestGrossingClients({
        start,
        end,
        limit,
      });

      expect(getHighestGrossingClientsSpy).toHaveBeenCalled();
      expect(getHighestGrossingClientsSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: expect.stringMatching(start),
          endDate: expect.stringMatching(end),
          limit,
        }),
      );
      expect(result).toEqual(expect.arrayContaining(clients));
    });

    it('should invoke all neccessary dependencies and return a success response if date and limit query is not passed.', async () => {
      const clients = [
        FactoryModel.Profile({
          total_paid: faker.finance.amount({ min: 50000, max: 300000 }),
        }),
      ];

      const getHighestGrossingClientsSpy = jest
        .spyOn(profileRepository, 'getHighestGrossingClients')
        .mockResolvedValue(clients as any);

      const defLimit = 2;

      const result = await adminService.getHighestGrossingClients({});

      expect(getHighestGrossingClientsSpy).toHaveBeenCalled();
      expect(getHighestGrossingClientsSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: expect.any(String),
          endDate: expect.any(String),
          limit: defLimit,
        }),
      );
      expect(result).toEqual(expect.arrayContaining(clients));
    });
  });
});
