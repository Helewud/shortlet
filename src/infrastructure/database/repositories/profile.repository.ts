import { Inject, Injectable } from '@nestjs/common';
import { In, QueryRunner, Repository } from 'typeorm';
import {
  RepositoryFindOptions,
  paginate,
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

  async exist(filter: Partial<ProfileEntity>, trx?: QueryRunner) {
    return wrapTransaction<typeof this.profileRepository.exists>(
      this.profileRepository,
      trx,
      'exists',
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

  async findAll(
    filter: Partial<ProfileEntity> | Partial<ProfileEntity>[],
    opts?: RepositoryFindOptions,
    trx?: QueryRunner,
  ) {
    const queryOptions = transformRepositoryFindOptions(opts);

    const respData = await wrapTransaction<
      typeof this.profileRepository.findAndCount
    >(this.profileRepository, trx, 'findAndCount', {
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

    return wrapTransaction<typeof this.profileRepository.find>(
      this.profileRepository,
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

  async deleteOne(filter: Partial<ProfileEntity>, trx?: QueryRunner) {
    return wrapTransaction<typeof this.profileRepository.softDelete>(
      this.profileRepository,
      trx,
      'softDelete',
      filter,
    );
  }

  async startTransaction(): Promise<QueryRunner> {
    const queryRunner =
      this.profileRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    return queryRunner;
  }
}
