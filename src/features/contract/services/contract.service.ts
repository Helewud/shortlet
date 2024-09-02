import { ContractRepository } from './../../../infrastructure/database/repositories/contract.repository';
import { Injectable } from '@nestjs/common';
import { ContractStatus } from '../../../common/enum';

@Injectable()
export class ContractService {
  constructor(private readonly contractRepository: ContractRepository) {}

  async getContract(dto: { contractId: number; profileId: number }) {
    return this.contractRepository.findOne(
      [
        {
          id: dto.contractId,
          client_id: dto.profileId,
        },
        {
          id: dto.contractId,
          contractor_id: dto.profileId,
        },
      ],
      {
        joins: [
          {
            field: 'client',
          },
          {
            field: 'contractor',
          },
        ],
      },
    );
  }

  async getManyContracts(dto: { profileId: number; status?: ContractStatus }) {
    return this.contractRepository.findAll(
      [
        {
          client_id: dto.profileId,
          status: dto?.status,
        },
        {
          contractor_id: dto.profileId,
          status: dto?.status,
        },
      ],
      {
        joins: [
          {
            field: 'client',
          },
          {
            field: 'contractor',
          },
        ],
      },
    );
  }
}
