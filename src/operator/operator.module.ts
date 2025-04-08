import { Module } from '@nestjs/common';
import { OperatorService } from './operator.service';
import { OperatorController } from './operator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from './entities/operator.entity';
import { WorkOrder } from 'src/work-order/entities/work-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operator, WorkOrder])],
  controllers: [OperatorController],
  providers: [OperatorService],
  exports: [OperatorService, TypeOrmModule]
})
export class OperatorModule {}
