import { Controller, Get, HttpCode, Query } from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { resolveSvcFn } from '../../../common/utils';
import { DocErrorResp } from '../../../common/docs/index';
import { AdminService } from '../services/admin.service';
import { GetHighestGrossingProfessionDto } from '../dto/get-highest-grossing-profession.dto';
import { GetHighestGrossingClientsDto } from '../dto/get-highest-grossing-clients.dto';

@ApiResponse(DocErrorResp.example)
@ApiTags('Admins')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @HttpCode(200)
  @ApiOkResponse()
  @Get('/best-profession')
  async getHighestGrossingProfession(
    @Query() query: GetHighestGrossingProfessionDto,
  ) {
    return resolveSvcFn(
      this.adminService.getHighestGrossingProfession(query),
      'highest grossing profession fetched successfully.',
    );
  }

  @HttpCode(200)
  @ApiOkResponse()
  @Get('/best-clients')
  async getHighestGrossingClients(
    @Query() query: GetHighestGrossingClientsDto,
  ) {
    return resolveSvcFn(
      this.adminService.getHighestGrossingClients(query),
      'highest grossing clients fetched successfully.',
    );
  }
}
