import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ProfileEntity } from '../../infrastructure/database/entities/profile.entity';

export type ProfileData = ProfileEntity;

export interface RequestWithUser extends Request {
  profile: ProfileEntity;
}

export const SessionProfile = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.profile;
  },
);
