import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkOrder } from 'src/work-order/entities/work-order.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
    
    @InjectRepository(WorkOrder)
    private workRepository: Repository<WorkOrder>,
  ){}
  create(createStockDto: CreateStockDto) {
    return this.stockRepository.save(createStockDto);
  }

  findAll(): Promise<Stock[]> {
    return this.stockRepository.find({relations: ['workOrder']});
  }

  findOne(id_stock: number) {
    return this.stockRepository.findOneBy({id_stock});
  }

  update(id_stock: number, updateStockDto: UpdateStockDto) {
    return this.stockRepository.update({id_stock}, updateStockDto);
  }

  remove(id_stock: number) {
    return this.stockRepository.softRemove({id_stock});
  }
}
