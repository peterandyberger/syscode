import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { BasicAuthGuard } from './basic-auth.guard';
import { AppService } from './app.service';
import type { AddressDto } from './app.service';

@ApiTags('address')
@ApiBasicAuth()
@Controller('address')
@UseGuards(BasicAuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({
    schema: {
      example: { id: 'uuid', address: 'HU, 1051 Budapest, Fo utca 12.' },
    },
  })
  getAddress(): AddressDto {
    return this.appService.getRandomAddress();
  }
}
