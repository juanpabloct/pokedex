import { Module } from '@nestjs/common';
import { getRequest } from './getRequest';

@Module({
  providers: [getRequest],
  exports: [getRequest],
})
export class CommonModule {}
