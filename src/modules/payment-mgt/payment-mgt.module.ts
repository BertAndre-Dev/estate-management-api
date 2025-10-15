import { Module } from '@nestjs/common';
import { PaymentMgtService } from './payment-mgt.service';
import { PaymentMgtController } from './payment-mgt.controller';

@Module({
  providers: [PaymentMgtService],
  controllers: [PaymentMgtController],
  exports: [PaymentMgtService]
})
export class PaymentMgtModule {}
