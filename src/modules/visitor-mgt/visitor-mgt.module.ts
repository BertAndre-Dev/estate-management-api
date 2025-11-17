import { Module } from '@nestjs/common';
import { VisitorMgtService } from './visitor-mgt.service';
import { VisitorMgtController } from './visitor-mgt.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Visitor, VisitorSchema } from 'src/schema/visitor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Visitor.name,
      schema: VisitorSchema
    }])
  ],
  providers: [VisitorMgtService],
  controllers: [VisitorMgtController]
})
export class VisitorMgtModule {}
