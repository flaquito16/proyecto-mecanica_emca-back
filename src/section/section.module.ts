import { Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Section } from './entities/section.entity';
import { Truck } from 'src/truck/entities/truck.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Section, Truck])],
  controllers: [SectionController],
  providers: [SectionService],
  exports: [SectionService, TypeOrmModule],
})
export class SectionModule {}
