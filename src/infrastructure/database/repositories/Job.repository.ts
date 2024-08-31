import { Inject, Injectable } from '@nestjs/common';
import { In, QueryRunner, Repository } from 'typeorm';
import {
  RepositoryFindOptions,
  paginate,
  transformRepositoryFindOptions,
  wrapTransaction,
} from './helper.repository';
import { JobEntity } from '../entities/jobs.entity';

@Injectable()
export class JobRepository {
  constructor(
    @Inject(JobEntity.name)
    private jobRepository: Repository<JobEntity>,
  ) {}

  async exist(filter: Partial<JobEntity>, trx?: QueryRunner) {
    return wrapTransaction<typeof this.jobRepository.exists>(
      this.jobRepository,
      trx,
      'exists',
      {
        where: filter,
      },
    );
  }

  async create(data: Partial<JobEntity>, trx?: QueryRunner) {
    const resp = await wrapTransaction<typeof this.jobRepository.save>(
      this.jobRepository,
      trx,
      'save',
      data,
    );

    return resp[0] as JobEntity;
  }

  async findOne(
    filter: Partial<JobEntity> | Partial<JobEntity>[],
    opts?: Pick<RepositoryFindOptions, 'joins' | 'select'>,
    trx?: QueryRunner,
  ) {
    const queryOptions = transformRepositoryFindOptions(opts);

    return wrapTransaction<typeof this.jobRepository.findOne>(
      this.jobRepository,
      trx,
      'findOne',
      {
        where: filter,
        ...queryOptions.typeormQuery,
      },
    );
  }

  async findAll(
    filter: Partial<JobEntity> | Partial<JobEntity>[],
    opts?: RepositoryFindOptions,
    trx?: QueryRunner,
  ) {
    const queryOptions = transformRepositoryFindOptions(opts);

    const respData = await wrapTransaction<
      typeof this.jobRepository.findAndCount
    >(this.jobRepository, trx, 'findAndCount', {
      where: filter,
      ...queryOptions.typeormQuery,
      ...queryOptions.pagination,
    });

    return paginate({
      limit: queryOptions?.pagination?.limit,
      page: queryOptions?.pagination?.page,
      count: respData[1],
      docs: respData[0],
    });
  }

  async findManyUsersById(
    userIds: string[],
    opts?: RepositoryFindOptions,
    trx?: QueryRunner,
  ) {
    const queryOptions = transformRepositoryFindOptions(opts);

    return wrapTransaction<typeof this.jobRepository.find>(
      this.jobRepository,
      trx,
      'find',
      {
        where: {
          id: In(userIds),
        },
        ...queryOptions.typeormQuery,
      },
    );
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

  async deleteOne(filter: Partial<JobEntity>, trx?: QueryRunner) {
    return wrapTransaction<typeof this.jobRepository.softDelete>(
      this.jobRepository,
      trx,
      'softDelete',
      filter,
    );
  }

  async startTransaction(): Promise<QueryRunner> {
    const queryRunner =
      this.jobRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    return queryRunner;
  }
}
