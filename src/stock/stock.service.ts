import { Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { In, Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ){}
  create(createStockDto: CreateStockDto) {
    return this.stockRepository.save(createStockDto);
  }

  findAll(): Promise<Stock[]> {
    return this.stockRepository.find({relations: ['work']});
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
