import { Inject, Injectable } from '@nestjs/common';
import { In, QueryRunner, Repository } from 'typeorm';
import {
  RepositoryFindOptions,
  paginate,
  transformRepositoryFindOptions,
  wrapTransaction,
} from './helper.repository';
import { ContractEntity } from '../entities/contract.entity';

@Injectable()
export class ContractRepository {
  constructor(
    @Inject(ContractEntity.name)
    private contractRepository: Repository<ContractEntity>,
  ) {}

  async exist(filter: Partial<ContractEntity>, trx?: QueryRunner) {
    return wrapTransaction<typeof this.contractRepository.exists>(
      this.contractRepository,
      trx,
      'exists',
      {
        where: filter,
      },
    );
  }

  async create(data: Partial<ContractEntity>, trx?: QueryRunner) {
    const resp = await wrapTransaction<typeof this.contractRepository.save>(
      this.contractRepository,
      trx,
      'save',
      data,
    );

    return resp[0] as ContractEntity;
  }

  async findOne(
    filter: Partial<ContractEntity> | Partial<ContractEntity>[],
    opts?: Pick<RepositoryFindOptions, 'joins' | 'select'>,
    trx?: QueryRunner,
  ) {
    const queryOptions = transformRepositoryFindOptions(opts);

    return wrapTransaction<typeof this.contractRepository.findOne>(
      this.contractRepository,
      trx,
      'findOne',
      {
        where: filter,
        ...queryOptions.typeormQuery,
      },
    );
  }

  async findAll(
    filter: Partial<ContractEntity> | Partial<ContractEntity>[],
    opts?: RepositoryFindOptions,
    trx?: QueryRunner,
  ) {
    const queryOptions = transformRepositoryFindOptions(opts);

    const respData = await wrapTransaction<
      typeof this.contractRepository.findAndCount
    >(this.contractRepository, trx, 'findAndCount', {
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

    return wrapTransaction<typeof this.contractRepository.find>(
      this.contractRepository,
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
    filter: Partial<ContractEntity>,
    update: Partial<ContractEntity>,
    trx?: QueryRunner,
  ) {
    return wrapTransaction<typeof this.contractRepository.update>(
      this.contractRepository,
      trx,
      'update',
      filter,
      update,
    );
  }

  async deleteOne(filter: Partial<ContractEntity>, trx?: QueryRunner) {
    return wrapTransaction<typeof this.contractRepository.softDelete>(
      this.contractRepository,
      trx,
      'softDelete',
      filter,
    );
  }

  async startTransaction(): Promise<QueryRunner> {
    const queryRunner =
      this.contractRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    return queryRunner;
  }
}
