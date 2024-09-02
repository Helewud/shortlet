import { Inject, Injectable } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { wrapTransaction } from './helper.repository';
import { JobEntity } from '../entities/job.entity';
import { ContractStatus } from '../../../common/enum';

@Injectable()
export class JobRepository {
  constructor(
    @Inject(JobEntity.name)
    private jobRepository: Repository<JobEntity>,
  ) {}

  async create(data: Partial<JobEntity>, trx?: QueryRunner) {
    const resp = await wrapTransaction<typeof this.jobRepository.save>(
      this.jobRepository,
      trx,
      'save',
      data,
    );

    return resp[0] as JobEntity;
  }

  async findJobsByProfileId(
    id: number,
    query?: {
      paymentStatus?: 'paid' | 'unpaid';
      contractStatus?: ContractStatus;
    },
    trx?: QueryRunner,
  ): Promise<JobEntity[]> {
    const whereConditions = [];

    if (query?.paymentStatus === 'paid') {
      whereConditions.push(`jobs.is_paid = true`);
    }

    if (query?.paymentStatus === 'unpaid') {
      whereConditions.push(`jobs.is_paid = false`);
    }

    if (query?.contractStatus) {
      whereConditions.push(`contracts.status = '${query?.contractStatus}'`);
    }

    const whereClause = whereConditions.length
      ? `${whereConditions.join(' AND ')}`
      : '';

    const statement = `
    SELECT
        jobs.*,
        ROW_TO_JSON(contracts.*) AS contract
    FROM jobs
    LEFT JOIN contracts ON contracts.id = jobs.contract_id
    WHERE
        (contracts.contractor_id = ${id} OR contracts.client_id = ${id} )
        AND ${whereClause}
    ORDER BY jobs.created_at DESC;`;

    const queryResp = await wrapTransaction<typeof this.jobRepository.query>(
      this.jobRepository,
      trx,
      'query',
      statement,
    );

    return queryResp;
  }

  async findJobByProfileId(
    filter: {
      jobId: number;
      profileId: number;
      paymentStatus?: 'paid' | 'unpaid';
      contractStatus?: ContractStatus;
    },
    trx?: QueryRunner,
  ): Promise<JobEntity> {
    const whereConditions = [];

    if (filter?.paymentStatus === 'paid') {
      whereConditions.push(`jobs.is_paid = true`);
    }

    if (filter?.paymentStatus === 'unpaid') {
      whereConditions.push(`jobs.is_paid = false`);
    }

    if (filter?.contractStatus) {
      whereConditions.push(`contracts.status = '${filter?.contractStatus}'`);
    }

    const whereClause = whereConditions.length
      ? `AND ${whereConditions.join(' AND ')}`
      : '';

    const statement = `
    SELECT
        jobs.*,
        ROW_TO_JSON(contracts.*) AS contract
    FROM jobs
    LEFT JOIN contracts ON contracts.id = jobs.contract_id
    WHERE
        jobs.id = ${filter.jobId}
        AND (contracts.contractor_id = ${filter.profileId} OR contracts.client_id = ${filter.profileId}) 
        ${whereClause}

    LIMIT 1;`;

    const queryResp = await wrapTransaction<typeof this.jobRepository.query>(
      this.jobRepository,
      trx,
      'query',
      statement,
    );

    return queryResp[0];
  }

  async updateOne(
    filter: Partial<JobEntity>,
    update: Partial<JobEntity>,
    trx?: QueryRunner,
  ) {
    return wrapTransaction<typeof this.jobRepository.update>(
      this.jobRepository,
      trx,
      'update',
      filter,
      update,
    );
  }

  async getPaymentPairs(): Promise<{
    job_id: number;
    session_profile_id: number;
    contractor_id: number;
    amount: number;
    client_balance: number;
  }> {
    const statement = `
    SELECT 
        jobs.id AS job_id,
        contract.client_id AS session_profile_id,
        contract.contractor_id,
        jobs.price AS amount,
        client.balance AS client_balance
    FROM 
        jobs
    INNER JOIN contracts contract ON jobs.contract_id = contract.id
    INNER JOIN profiles client ON contract.client_id = client.id
    INNER JOIN profiles contractor ON contract.contractor_id = contractor.id
    WHERE
        jobs.is_paid = false
        AND client.balance >= jobs.price
        AND contract.status = 'in_progress'
    ORDER BY 
        jobs.id ASC`;

    const queryResp = await wrapTransaction<typeof this.jobRepository.query>(
      this.jobRepository,
      null,
      'query',
      statement,
    );

    return queryResp;
  }

  async startTransaction(): Promise<QueryRunner> {
    const queryRunner =
      this.jobRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    return queryRunner;
  }

  async commitTransaction(tx: QueryRunner): Promise<void> {
    await tx.commitTransaction();
    await tx.release();
  }
}
