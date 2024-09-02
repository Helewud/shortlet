import { Repository, QueryRunner } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import {
  transformRepositoryFindOptions,
  wrapTransaction,
} from './helper.repository';

describe('Repository Utility Functions', () => {
  describe('transformRepositoryFindOptions', () => {
    it('should handle limit and page correctly', () => {
      const options = { limit: 10, page: 2 };
      const result = transformRepositoryFindOptions(options);
      expect(result.typeormQuery).toHaveProperty('take', 10);
      expect(result.typeormQuery).toHaveProperty('skip', 10);
    });

    it('should apply default values when limit and page are invalid', () => {
      const options = { limit: 0, page: -1 };
      const result = transformRepositoryFindOptions(options);
      expect(result.typeormQuery).toHaveProperty('take', 20);
      expect(result.typeormQuery).toHaveProperty('skip', 0);
    });

    it('should correctly handle joins and nested select fields', () => {
      const options = {
        joins: [
          {
            field: 'profile',
            select: ['firstName', 'lastName'],
          },
        ],
      };
      const result = transformRepositoryFindOptions(options);
      expect(result.typeormQuery.relations).toEqual({ profile: true });
      expect(result.typeormQuery.select).toEqual({
        id: true,
        profile: { firstName: true, lastName: true },
      });
    });
  });

  describe('wrapTransaction function', () => {
    let repo: Repository<any>;
    let trx: QueryRunner;

    beforeEach(() => {
      repo = createMock<Repository<any>>();
      trx = createMock<QueryRunner>();
    });

    it('should call the correct repository method when no transaction is provided', async () => {
      await wrapTransaction(repo, null, 'save', {});
      expect(repo.save).toHaveBeenCalledWith([{}]);
    });

    it('should call the correct transaction manager method when transaction is provided', async () => {
      await wrapTransaction(repo, trx, 'save', {});
      expect(trx.manager.save).toHaveBeenCalledWith('SomeEntity', [{}]);
    });

    it('should handle update method correctly with transaction', async () => {
      const updatePayload = { id: 1, name: 'Test' };
      await wrapTransaction(repo, trx, 'update', 1, updatePayload);
      expect(trx.manager.update).toHaveBeenCalledWith(
        'SomeEntity',
        1,
        updatePayload,
      );
    });

    it('should handle findOne method correctly without transaction', async () => {
      const criteria = { id: 1 };
      await wrapTransaction(repo, null, 'findOne', criteria);
      expect(repo.findOne).toHaveBeenCalledWith(criteria);
    });
  });
});
