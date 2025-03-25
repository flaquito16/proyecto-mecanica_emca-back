import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { TruckService } from './truck.service';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiTags('truck')
@ApiBearerAuth()
@Controller('truck')
export class TruckController {
  constructor(private readonly truckService: TruckService) {}

  @Post()
  create(@Body() createTruckDto: CreateTruckDto) {
    return this.truckService.create(createTruckDto);
  }

  @Get()
  async findAll() {
    return this.truckService.findAllWithWorkOrders();
  }


  @Get(':id')
  async findOne(@Param('id') id: number) {
      const details = await this.truckService.findById(id);
      if (!details) {
          throw new NotFoundException(`Camión con ID ${id} no encontrado.`);
      }
      return details;
    }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTruckDto: UpdateTruckDto) {
    return this.truckService.update(+id, updateTruckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.truckService.remove(+id);
  }
}
