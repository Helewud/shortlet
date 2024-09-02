import { faker } from '@faker-js/faker';
import { ContractStatus, ProfileRoles } from '../enum';
import { ProfileEntity } from '../../infrastructure/database/entities/profile.entity';
import { ContractEntity } from '../../infrastructure/database/entities/contract.entity';
import { JobEntity } from '../../infrastructure/database/entities/job.entity';

const FactoryModel = {
  Profile(overrides = {}): ProfileEntity {
    return {
      id: faker.number.int({ min: 1, max: 15 }),
      uuid: faker.string.uuid(),
      createdAt: faker.date.recent(10),
      updatedAt: faker.date.recent(5),

      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      profession: faker.person.jobType(),
      balance: +faker.finance.amount({ min: 50000, max: 300000 }),
      role: faker.helpers.arrayElement(Object.values(ProfileRoles)),
      ...overrides,
    };
  },

  Contract(overrides = {}): ContractEntity {
    return {
      id: faker.number.int({ min: 1, max: 15 }),
      uuid: faker.string.uuid(),
      createdAt: faker.date.recent(10),
      updatedAt: faker.date.recent(5),

      terms: faker.lorem.paragraph(),
      status: faker.helpers.arrayElement([
        ContractStatus.NEW,
        ContractStatus.IN_PROGRESS,
      ]),
      client_id: faker.number.int({ min: 1, max: 15 }),
      contractor_id: faker.number.int({ min: 1, max: 15 }),
      ...overrides,
    };
  },

  Job(overrides = {}): JobEntity {
    return {
      id: faker.number.int({ min: 1, max: 15 }),
      uuid: faker.string.uuid(),
      createdAt: faker.date.recent(10),
      updatedAt: faker.date.recent(5),

      description: faker.commerce.productDescription(),
      price: +faker.finance.amount({ min: 5000, max: 70000 }),
      is_paid: false,
      paid_date: null,
      contract_id: faker.number.int({ min: 1, max: 15 }),
      ...overrides,
    };
  },
};

export default FactoryModel;
