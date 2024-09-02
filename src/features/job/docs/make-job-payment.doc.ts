import { ApiDocPayload } from '../../../common/docs/api.payload.doc';

export const MakeJobPaymentResp = {
  example: new ApiDocPayload({
    status: 'success',
    message: 'job payment processed successfully.',
    data: {
      id: 7,
      uuid: '2007de59-9d53-4ab9-9b96-8c03656d005b',
      created_at: '2024-08-23T14:09:07.230Z',
      updated_at: '2024-08-29T21:15:22.718Z',
      description:
        'The Apollotech B340 is an affordable wireless mouse with reliable connectivity, 12 months battery life and modern design',
      price: '35650.78',
      is_paid: true,
      paid_date: null,
      contract_id: 2,
      contract: {
        id: 2,
        uuid: '5f9c5a07-98a6-4888-9142-b69f81f86ff2',
        created_at: '2024-08-23T11:36:01.093',
        updated_at: '2024-08-31T17:06:44.077',
        terms:
          'Aeger damno bene defungo arguo ambulo. Temptatio conturbo commemoro supellex uredo maiores torrens. Stillicidium denuncio argentum et cernuus correptius caelestis aegrus itaque.',
        status: 'in_progress',
        contractor_id: 10,
        client_id: 1,
      },
    },
  }),
};
