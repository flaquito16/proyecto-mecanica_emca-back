import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('stock')
@ApiBearerAuth()
@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto);
  }

  @Get()
  findAll() {
    return this.stockService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.stockService.findOne(+id);
  }

  @Get('work/:')

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateStockDto: UpdateStockDto) {
    return this.stockService.update(+id, updateStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.stockService.remove(+id);
  }
}
