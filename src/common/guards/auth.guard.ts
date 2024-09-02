import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ProfileRepository } from '../../infrastructure/database/repositories/profile.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const id = req.headers['id'];

    if (!id) {
      throw new UnauthorizedException('id is missing!');
    }

    const profile = await this.profileRepository.findOne({ id: +id });

    if (!profile) {
      throw new UnauthorizedException('invalid session!');
    }

    req['profile'] = profile;

    return true;
  }
}
