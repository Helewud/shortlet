import { ApiDocPayload } from '../../../common/docs/api.payload.doc';

export const GetPaymentPairsResp = {
  example: new ApiDocPayload({
    status: 'success',
    message: 'job payment pairs fetched successfully.',
    data: [
      {
        job_id: 26,
        session_profile_id: 6,
        contractor_id: 9,
        amount: '51743.29',
        client_balance: '208161.66',
      },
      {
        job_id: 27,
        session_profile_id: 6,
        contractor_id: 9,
        amount: '48736.05',
        client_balance: '208161.66',
      },
      {
        job_id: 29,
        session_profile_id: 6,
        contractor_id: 9,
        amount: '59064.05',
        client_balance: '208161.66',
      },
    ],
  }),
};
