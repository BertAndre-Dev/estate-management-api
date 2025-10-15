import { Module } from '@nestjs/common';
import { VisitorMgtService } from './visitor-mgt.service';
import { VisitorMgtController } from './visitor-mgt.controller';

@Module({
  providers: [VisitorMgtService],
  controllers: [VisitorMgtController]
})
export class VisitorMgtModule {}
