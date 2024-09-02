import { ApiDocPayload } from './api.payload.doc';

export const DocErrorResp = {
  example: new ApiDocPayload({
    status: 'error',
    code: 500,
    message: 'Unauthorized',
  }),
};
