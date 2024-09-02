import { ApiDocPayload } from '../../../common/docs/api.payload.doc';

export const GetUnpaidJobsResp = {
  example: new ApiDocPayload({
    status: 'success',
    message: 'Jobs fetched successfully.',
    data: [
      {
        id: 14,
        uuid: '03b427d7-5abe-4968-b83a-ed991392493e',
        created_at: '2024-08-30T03:37:39.668Z',
        updated_at: '2024-08-29T07:15:22.396Z',
        description:
          'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
        price: '20973.35',
        is_paid: false,
        paid_date: null,
        contract_id: 10,
        contract: {
          id: 10,
          uuid: '4f082309-0e93-47cc-bc88-dec49b40b0a4',
          created_at: '2024-08-31T06:38:26.353',
          updated_at: '2024-08-29T02:07:31.944',
          terms:
            'Tertius repellat terminatio bestia. Totam magni spiculum alias carus adsidue ultio. Avaritia theca debilito.',
          status: 'new',
          contractor_id: 3,
          client_id: 6,
          contractorId: null,
          clientId: null,
        },
      },
    ],
  }),
};
