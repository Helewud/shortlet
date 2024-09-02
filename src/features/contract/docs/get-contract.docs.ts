import { ApiDocPayload } from '../../../common/docs/api.payload.doc';

export const GetContractResp = {
  example: new ApiDocPayload({
    status: 'success',
    message: 'contract fetched successfully.',
    data: {
      id: 3,
      uuid: 'ab2b9aa5-3d2e-494f-b11f-5d71f4cc95bf',
      createdAt: '2024-08-30T09:23:04.048Z',
      updatedAt: '2024-08-27T14:51:05.200Z',
      terms:
        'Conventus amicitia cotidie somniculosus sufficio cetera abstergo. Nisi strenuus abscido congregatio. Creber cado aptus vergo aer.',
      status: 'new',
      contractor_id: 9,
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
        id: 9,
        uuid: '152f05e1-2c3a-4d8c-b127-202bf14d3d2b',
        createdAt: '2024-08-24T19:24:19.262Z',
        updatedAt: '2024-08-28T00:10:47.604Z',
        first_name: 'Breana',
        last_name: 'Crona',
        profession: 'Research',
        balance: '287063.8',
        role: 'contractor',
      },
    },
  }),
};
