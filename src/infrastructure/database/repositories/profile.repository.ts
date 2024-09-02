import { Inject, Injectable } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import {
  RepositoryFindOptions,
  transformRepositoryFindOptions,
  wrapTransaction,
} from './helper.repository';
import { ProfileEntity } from '../entities/profile.entity';

@Injectable()
export class ProfileRepository {
  constructor(
    @Inject(ProfileEntity.name)
    private profileRepository: Repository<ProfileEntity>,
  ) {}

  async count(filter: Partial<ProfileEntity>, trx?: QueryRunner) {
    return wrapTransaction<typeof this.profileRepository.count>(
      this.profileRepository,
      trx,
      'count',
      {
        where: filter,
      },
    );
  }

  async create(data: Partial<ProfileEntity>, trx?: QueryRunner) {
    const resp = await wrapTransaction<typeof this.profileRepository.save>(
      this.profileRepository,
      trx,
      'save',
      data,
    );

    return resp[0] as ProfileEntity;
  }

  async incrementBalance(
    filter: Partial<ProfileEntity>,
    amount: number,
    trx?: QueryRunner,
  ) {
    const resp = await wrapTransaction<typeof this.profileRepository.increment>(
      this.profileRepository,
      trx,
      'increment',
      filter,
      'balance',
      amount,
    );

    return resp[0] as ProfileEntity;
  }

  async findOne(
    filter: Partial<ProfileEntity> | Partial<ProfileEntity>[],
    opts?: Pick<RepositoryFindOptions, 'joins' | 'select'>,
    trx?: QueryRunner,
  ) {
    const queryOptions = transformRepositoryFindOptions(opts);

    return wrapTransaction<typeof this.profileRepository.findOne>(
      this.profileRepository,
      trx,
      'findOne',
      {
        where: filter,
        ...queryOptions.typeormQuery,
      },
    );
  }

  async updateOne(
    filter: Partial<ProfileEntity>,
    update: Partial<ProfileEntity>,
    trx?: QueryRunner,
  ) {
    return wrapTransaction<typeof this.profileRepository.update>(
      this.profileRepository,
      trx,
      'update',
      filter,
      update,
    );
  }

  async getHighestGrossingProfession(
    filter: {
      startDate: string;
      endDate: string;
    },
    trx?: QueryRunner,
  ): Promise<string> {
    const statement = `
    SELECT p.profession, SUM(j.price) as total_earnings
    FROM profiles p
    INNER JOIN contracts c ON p.id = c.contractor_id
    INNER JOIN jobs j ON c.id = j.contract_id
    WHERE j.is_paid = true
        AND j.paid_date BETWEEN '${filter.startDate}' AND '${filter.endDate}'
        AND p.role = 'contractor'
    GROUP BY p.profession
    ORDER BY total_earnings DESC
    LIMIT 1;`;

    const queryResp = await wrapTransaction<
      typeof this.profileRepository.query
    >(this.profileRepository, trx, 'query', statement);

    return queryResp[0];
  }

  async getHighestGrossingClients(
    filter: {
      startDate: string;
      endDate: string;
      limit: number;
    },
    trx?: QueryRunner,
  ): Promise<ProfileEntity & { total_paid: string }[]> {
    const statement = `
    WITH client_payments AS (
        SELECT 
            c.client_id,
            SUM(j.price) AS total_paid
        FROM 
            jobs j
        INNER JOIN contracts c ON j.contract_id = c.id
        WHERE 
            j.is_paid = true
            AND j.paid_date BETWEEN '${filter.startDate}' AND '${filter.startDate}'
        GROUP BY 
            c.client_id
    )
    SELECT 
        p.*,
        cp.total_paid
    FROM 
        client_payments cp
    INNER JOIN profiles p ON cp.client_id = p.id
    ORDER BY 
        cp.total_paid DESC
    LIMIT '${filter.limit}'`;

    const queryResp = await wrapTransaction<
      typeof this.profileRepository.query
    >(this.profileRepository, trx, 'query', statement);

    return queryResp;
  }

  async getLedgerBalanceById(
    filter: {
      profileId: number;
    },
    trx?: QueryRunner,
  ): Promise<{ settled_balance: string; outstanding_balance: string }> {
    const statement = `
    SELECT
        SUM(CASE WHEN jobs.is_paid = true THEN jobs.price ELSE 0 END) as settled_balance,
        SUM(CASE WHEN jobs.is_paid = false THEN jobs.price ELSE 0 END) as outstanding_balance
    FROM contracts
    LEFT JOIN jobs ON contracts.id = jobs.contract_id
    WHERE contracts.client_id = ${filter.profileId};`;

    const queryResp = await wrapTransaction<
      typeof this.profileRepository.query
    >(this.profileRepository, trx, 'query', statement);

    return queryResp[0];
  }

  async startTransaction(): Promise<QueryRunner> {
    const queryRunner =
      this.profileRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    return queryRunner;
  }

  async commitTransaction(tx: QueryRunner): Promise<void> {
    await tx.commitTransaction();
    await tx.release();
  }
}
