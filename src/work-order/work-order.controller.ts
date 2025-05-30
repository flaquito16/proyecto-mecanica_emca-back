import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { WorkOrderService } from './work-order.service';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('work-order')
@ApiBearerAuth()
@Controller('work-order')
export class WorkOrderController {
  constructor(private readonly workOrderService: WorkOrderService) {}

  @Post()
  create(@Body() createWorkOrderDto: CreateWorkOrderDto) {
    return this.workOrderService.create(createWorkOrderDto);
  }

  @Get()
  findAll() {
    return this.workOrderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const details = await this.workOrderService.findById(id)
    if (!details) {
      throw new NotFoundException(`Orden con ID ${id} no encontrado.`)
    }
    return details;
  }

  @Get('operator/:operatorId')
  async findByOperator(@Param('operatorId') operatorId: number) {
    return this.workOrderService.findByOperator(+operatorId);
  } 

  @Get('truck/:truckId')
  async findByTruck(@Param('truckId') truckId: number) {
    return this.workOrderService.findByTruck(+truckId);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateWorkOrderDto: UpdateWorkOrderDto) {
    return this.workOrderService.update(+id, updateWorkOrderDto);
  }


  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.workOrderService.remove(+id);
  }
}
