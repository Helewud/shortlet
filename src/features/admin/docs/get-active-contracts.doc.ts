import { ApiDocPayload } from '../../../common/docs/api.payload.doc';

export const GetActiveContractsResp = {
  example: new ApiDocPayload({
    status: 'success',
    message: 'active contracts fetched successfully.',
    data: [
      {
        id: 2,
        uuid: '5f9c5a07-98a6-4888-9142-b69f81f86ff2',
        createdAt: '2024-08-23T10:36:01.093Z',
        updatedAt: '2024-08-31T16:06:44.077Z',
        terms:
          'Aeger damno bene defungo arguo ambulo. Temptatio conturbo commemoro supellex uredo maiores torrens. Stillicidium denuncio argentum et cernuus correptius caelestis aegrus itaque.',
        status: 'in_progress',
        contractor_id: 10,
        client_id: 1,
        client: {
          id: 1,
          uuid: 'f982628d-a69d-4aef-a624-3f7ca0fa7ebd',
          createdAt: '2024-08-31T18:13:19.572Z',
          updatedAt: '2024-08-30T02:49:20.896Z',
          first_name: 'Sheldon',
          last_name: 'Mayer',
          profession: 'Metrics',
          balance: '156208.68',
          role: 'client',
        },
        contractor: {
          id: 10,
          uuid: 'f1f16023-573c-49ad-8905-7b756645bcdb',
          createdAt: '2024-08-29T15:23:56.067Z',
          updatedAt: '2024-08-29T01:35:27.248Z',
          first_name: 'Roberto',
          last_name: 'Anderson',
          profession: 'Interactions',
          balance: '167831.3',
          role: 'contractor',
        },
      },
    ],
  }),
};
