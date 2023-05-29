import { Controller, Get, Param } from '@nestjs/common';
import { SeedService } from './seed.service';
import { TransformNumberPipe } from 'src/common/transfom-number.pipe';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('clear')
  async clearData() {
    return await this.seedService.seedClear();
  }
  @Get(':count')
  async findAll(@Param('count', TransformNumberPipe) count: number) {
    return await this.seedService.seedExecute(count);
  }
}
