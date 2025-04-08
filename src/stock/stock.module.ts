import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { WorkOrder } from 'src/work-order/entities/work-order.entity';
import { WorkOrderModule } from 'src/work-order/work-order.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, WorkOrder]),
  WorkOrderModule,
],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService, TypeOrmModule],
})
export class StockModule {}
