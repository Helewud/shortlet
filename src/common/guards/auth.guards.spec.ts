import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { ProfileRepository } from '../../infrastructure/database/repositories/profile.repository';
import { createMock } from '@golevelup/ts-jest';
import { Request } from 'express';
import FactoryModel from '../factories/builder';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let profileRepository: ProfileRepository;

  beforeEach(() => {
    profileRepository = createMock<ProfileRepository>();
    authGuard = new AuthGuard(profileRepository);
  });

  it('should return true if id is valid and profile is found', async () => {
    const mockProfile = FactoryModel.Profile({ id: 1 });
    jest.spyOn(profileRepository, 'findOne').mockResolvedValue(mockProfile);

    const mockRequest = {
      headers: { id: '1' },
      ['profile']: undefined,
    } as unknown as Request;

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    const result = await authGuard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
    expect(mockRequest['profile']).toEqual(mockProfile);
    expect(profileRepository.findOne).toHaveBeenCalledWith({ id: 1 });
  });

  it('should throw an UnauthorizedException if id is missing', async () => {
    const mockRequest = {
      headers: {},
    } as unknown as Request;

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
      new UnauthorizedException('id is missing!'),
    );
    expect(profileRepository.findOne).not.toHaveBeenCalled();
  });

  it('should throw an UnauthorizedException if profile is not found', async () => {
    jest.spyOn(profileRepository, 'findOne').mockResolvedValue(null);

    const mockRequest = {
      headers: { id: '1' },
    } as unknown as Request;

    const mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;

    await expect(authGuard.canActivate(mockExecutionContext)).rejects.toThrow(
      new UnauthorizedException('invalid session!'),
    );
    expect(profileRepository.findOne).toHaveBeenCalledWith({ id: 1 });
  });
});
