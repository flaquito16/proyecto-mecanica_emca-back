import { WorkOrder } from './entities/work-order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WorkOrderService } from './work-order.service';
import { WorkOrderController } from './work-order.controller';
import { Truck } from 'src/truck/entities/truck.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Operator } from 'src/operator/entities/operator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkOrder, Truck, Stock, Operator])],
  controllers: [WorkOrderController],
  providers: [WorkOrderService],
  exports: [WorkOrderService, TypeOrmModule]
})
export class WorkOrderModule {}
