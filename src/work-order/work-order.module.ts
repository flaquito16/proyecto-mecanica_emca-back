import { WorkOrder } from './entities/work-order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { WorkOrderService } from './work-order.service';
import { WorkOrderController } from './work-order.controller';
import { Truck } from 'src/truck/entities/truck.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkOrder, Truck])],
  controllers: [WorkOrderController],
  providers: [WorkOrderService],
  exports: [WorkOrderService, TypeOrmModule]
})
export class WorkOrderModule {}
