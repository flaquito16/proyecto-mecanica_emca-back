// src/pdf/pdf.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Truck } from 'src/truck/entities/truck.entity';
import { Operator } from 'src/operator/entities/operator.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { WorkOrder } from 'src/work-order/entities/work-order.entity';
import { informesController } from './informes.controller';
import { informesService } from './informes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkOrder, Truck, Operator, Stock]),
  ],
  controllers: [informesController],
  providers: [informesService],
})
export class informesModule {}
