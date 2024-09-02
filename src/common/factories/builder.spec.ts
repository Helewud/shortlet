import { ContractStatus } from '../enum';
import { ProfileEntity } from '../../infrastructure/database/entities/profile.entity';
import { ContractEntity } from '../../infrastructure/database/entities/contract.entity';
import { JobEntity } from '../../infrastructure/database/entities/job.entity';
import FactoryModel from './builder';

describe('FactoryModel', () => {
  describe('Profile', () => {
    it('should create a ProfileEntity with the correct structure', () => {
      const profile: ProfileEntity = FactoryModel.Profile();

      expect(profile).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          uuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          first_name: expect.any(String),
          last_name: expect.any(String),
          profession: expect.any(String),
          balance: expect.any(Number),
          role: expect.any(String),
        }),
      );
    });

    it('should override default properties when provided', () => {
      const overrides = { first_name: 'John', last_name: 'Doe' };
      const profile: ProfileEntity = FactoryModel.Profile(overrides);

      expect(profile).toEqual(
        expect.objectContaining({
          first_name: 'John',
          last_name: 'Doe',
        }),
      );
    });
  });

  describe('Contract', () => {
    it('should create a ContractEntity with the correct structure', () => {
      const contract: ContractEntity = FactoryModel.Contract();

      expect(contract).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          uuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          terms: expect.any(String),
          status: expect.any(String),
          client_id: expect.any(Number),
          contractor_id: expect.any(Number),
        }),
      );
    });

    it('should override default properties when provided', () => {
      const overrides = { status: ContractStatus.NEW };
      const contract: ContractEntity = FactoryModel.Contract(overrides);

      expect(contract).toEqual(
        expect.objectContaining({
          status: ContractStatus.NEW,
        }),
      );
    });
  });

  describe('Job', () => {
    it('should create a JobEntity with the correct structure', () => {
      const job: JobEntity = FactoryModel.Job();

      expect(job).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          uuid: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          description: expect.any(String),
          price: expect.any(Number),
          is_paid: expect.any(Boolean),
          paid_date: null,
          contract_id: expect.any(Number),
        }),
      );
    });

    it('should override default properties when provided', () => {
      const overrides = { is_paid: true };
      const job: JobEntity = FactoryModel.Job(overrides);

      expect(job).toEqual(
        expect.objectContaining({
          is_paid: true,
        }),
      );
    });
  });
});
