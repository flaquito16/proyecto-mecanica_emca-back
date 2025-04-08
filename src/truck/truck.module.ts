import { Module } from '@nestjs/common';
import { TruckService } from './truck.service';
import { TruckController } from './truck.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Truck } from './entities/truck.entity';
import { Section } from 'src/section/entities/section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Truck, Section])],
  controllers: [TruckController],
  providers: [TruckService],
  exports: [TruckService, TypeOrmModule],
})
export class TruckModule {}
