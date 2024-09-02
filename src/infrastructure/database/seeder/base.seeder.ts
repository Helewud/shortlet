import { Injectable, Logger } from '@nestjs/common';
import { ContractRepository } from '../repositories/contract.repository';
import { ProfileRepository } from '../repositories/profile.repository';
import FactoryModel from '../../../common/factories/builder';
import { JobRepository } from '../repositories/job.repository';
import { ProfileEntity } from '../entities/profile.entity';
import { ProfileRoles } from '../../../common/enum';

@Injectable()
export class SeederRepository {
  private readonly logger = new Logger(SeederRepository.name);

  constructor(
    private readonly contractRepository: ContractRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly jobRepository: JobRepository,
  ) {}

  async onModuleInit() {
    const count = await this.profileRepository.count({});
    if (count > 0) return;

    const profileCount = 10; // Increased to ensure a mix of clients and contractors
    const contractCount = 3; // Number of contracts per client
    const jobCount = 2; // Number of jobs per contract

    const profiles = await this.createProfiles(profileCount);
    const contracts = await this.createContracts(profiles, contractCount);
    await this.createJobs(contracts, jobCount);

    this.logger.log(
      `${profileCount} profiles, ${contracts.length} contracts, and ${contracts.length * jobCount} jobs created.`,
    );
  }

  private async createProfiles(count: number): Promise<ProfileEntity[]> {
    const profiles = Array(count)
      .fill(null)
      .map(() => {
        const role =
          Math.random() < 0.5 ? ProfileRoles.CLIENT : ProfileRoles.CONTRACTOR;
        return FactoryModel.Profile({ id: null, role });
      });
    return await Promise.all(
      profiles.map((profile) => this.profileRepository.create(profile)),
    );
  }

  private async createContracts(
    profiles: ProfileEntity[],
    contractsPerClient: number,
  ) {
    const clients = profiles.filter((p) => p.role === ProfileRoles.CLIENT);
    const contractors = profiles.filter(
      (p) => p.role === ProfileRoles.CONTRACTOR,
    );

    if (contractors.length === 0) {
      throw new Error('No contractors available to create contracts');
    }

    const contracts = [];
    for (const client of clients) {
      for (let i = 0; i < contractsPerClient; i++) {
        const contractor =
          contractors[Math.floor(Math.random() * contractors.length)];
        contracts.push(
          FactoryModel.Contract({
            client_id: client.id,
            contractor_id: contractor.id,
            id: null,
          }),
        );
      }
    }
    return await Promise.all(
      contracts.map((contract) => this.contractRepository.create(contract)),
    );
  }

  private async createJobs(contracts: any[], jobsPerContract: number) {
    const jobs = contracts.flatMap((contract) =>
      Array(jobsPerContract)
        .fill(null)
        .map(() =>
          FactoryModel.Job({
            contract_id: contract.id,
            id: null,
          }),
        ),
    );
    await Promise.all(jobs.map((job) => this.jobRepository.create(job)));
  }
}
