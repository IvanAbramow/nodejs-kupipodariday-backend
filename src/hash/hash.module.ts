import { Module } from '@nestjs/common';
import { HashController } from './hash.controller';
import { HashService } from './hash.service';

@Module({
  controllers: [HashController],
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}