import { createMock } from '@golevelup/ts-jest';
import FactoryModel from '../../../common/factories/builder';
import { ContractRepository } from '../../../infrastructure/database/repositories/contract.repository';
import { ContractService } from './contract.service';
import { ContractStatus } from '../../../common/enum';

describe('ContractService', () => {
  let contractRepository: ContractRepository;
  let contractService: ContractService;

  beforeEach(async () => {
    contractRepository = createMock<ContractRepository>();
    contractService = new ContractService(contractRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getContract', () => {
    it('should invoke all neccessary dependencies and return the response.', async () => {
      const contract = FactoryModel.Contract();

      const findOneSpy = jest
        .spyOn(contractRepository, 'findOne')
        .mockResolvedValue(contract);

      const result = await contractService.getContract({
        profileId: 1,
        contractId: 2,
      });

      expect(findOneSpy).toHaveBeenCalled();
      expect(result).toEqual(
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
  });

  describe('getManyContracts', () => {
    it('should invoke all neccessary dependencies and return the response.', async () => {
      const contracts = [FactoryModel.Contract()];

      const findAllSpy = jest
        .spyOn(contractRepository, 'findAll')
        .mockResolvedValue(contracts);

      const result = await contractService.getManyContracts({
        profileId: 1,
        status: ContractStatus.NEW,
      });

      expect(findAllSpy).toHaveBeenCalled();
      expect(result).toEqual(expect.arrayContaining(contracts));
    });
  });
});
