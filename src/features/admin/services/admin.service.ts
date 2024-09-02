import { Injectable } from '@nestjs/common';
import { GetHighestGrossingProfessionDto } from '../dto/get-highest-grossing-profession.dto';
import { ProfileRepository } from '../../../infrastructure/database/repositories/profile.repository';
import { GetHighestGrossingClientsDto } from '../dto/get-highest-grossing-clients.dto';

@Injectable()
export class AdminService {
  constructor(private readonly profileRepository: ProfileRepository) {}

  async getHighestGrossingProfession(dto: GetHighestGrossingProfessionDto) {
    if (!dto?.start) {
      dto.start = new Date(
        new Date().setDate(new Date().getDate() - 30),
      ).toISOString();
    }

    if (!dto?.end) {
      dto.end = new Date().toISOString();
    }

    return this.profileRepository.getHighestGrossingProfession({
      startDate: dto.start,
      endDate: dto.end,
    });
  }

  async getHighestGrossingClients(dto: GetHighestGrossingClientsDto) {
    if (!dto?.start) {
      dto.start = new Date(
        new Date().setDate(new Date().getDate() - 7),
      ).toISOString();
    }

    if (!dto?.end) {
      dto.end = new Date().toISOString();
    }

    if (!dto?.limit) {
      dto.limit = 2;
    }

    return this.profileRepository.getHighestGrossingClients({
      startDate: dto.start,
      endDate: dto.end,
      limit: dto.limit,
    });
  }
}
