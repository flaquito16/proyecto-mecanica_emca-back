import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { OperatorService } from './operator.service';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('operator')
@ApiBearerAuth()
@Controller('operator')
export class OperatorController {
  constructor(private readonly operatorService: OperatorService) {}

  @Post()
  create(@Body() createOperatorDto: CreateOperatorDto) {
    return this.operatorService.create(createOperatorDto);
  }

  @Get()
  findAll() {
    return this.operatorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    const details = this.operatorService.findById(id);
    if (!details) {
      throw new NotFoundException(`Operador con ID ${id} no encontrado.`);
    }
    return details
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateOperatorDto: UpdateOperatorDto) {
    return this.operatorService.update(+id, updateOperatorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.operatorService.remove(+id);
  }
}
