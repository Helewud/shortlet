import { faker } from '@faker-js/faker';
import { createMock } from '@golevelup/ts-jest';
import { JobRepository } from '../../../infrastructure/database/repositories/job.repository';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let jobRepository: JobRepository;
  let utilsService: UtilsService;

  beforeEach(async () => {
    jobRepository = createMock<JobRepository>();
    utilsService = new UtilsService(jobRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPaymentPairs', () => {
    it('should call getPaymentPairs and return the correct response', async () => {
      const result = {
        job_id: faker.number.int({ min: 1, max: 15 }),
        session_profile_id: faker.number.int({ min: 1, max: 15 }),
        contractor_id: faker.number.int({ min: 1, max: 15 }),
        amount: +faker.finance.amount({ min: 5000, max: 70000 }),
        client_balance: +faker.finance.amount({ min: 5000, max: 70000 }),
      };

      const jobRepoSpy = jest
        .spyOn(jobRepository, 'getPaymentPairs')
        .mockResolvedValue(result);

      const utilsSvcSpy = jest.spyOn(utilsService, 'getPaymentPairs');

      const response = await utilsService.getPaymentPairs();

      expect(jobRepoSpy).toHaveBeenCalled();
      expect(utilsSvcSpy).toHaveBeenCalled();
      expect(response).toMatchObject(
        expect.objectContaining({
          job_id: expect.any(Number),
          session_profile_id: expect.any(Number),
          contractor_id: expect.any(Number),
          amount: expect.any(Number),
          client_balance: expect.any(Number),
        }),
      );
    });
  });
});
