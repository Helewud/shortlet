import { Inject, Injectable } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import {
  RepositoryFindOptions,
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

  async create(data: Partial<ContractEntity>, trx?: QueryRunner) {
    const resp = await wrapTransaction<typeof this.contractRepository.save>(
      this.contractRepository,
      trx,
      'save',
      data,
    );

    return resp[0] as ContractEntity;
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

    const respData = await wrapTransaction<typeof this.contractRepository.find>(
      this.contractRepository,
      trx,
      'find',
      {
        where: filter,
        ...queryOptions.typeormQuery,
      },
    );

    return respData;
  }

  async startTransaction(): Promise<QueryRunner> {
    const queryRunner =
      this.contractRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    return queryRunner;
  }

  async commitTransaction(tx: QueryRunner): Promise<void> {
    await tx.commitTransaction();
    await tx.release();
  }
}
