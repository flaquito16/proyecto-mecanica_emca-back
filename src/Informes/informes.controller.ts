import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { informesService } from './informes.service';
import { WorkOrder } from 'src/work-order/entities/work-order.entity';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('PDF')
@ApiBearerAuth()
@Controller('pdf')
export class informesController {
  constructor(
    private readonly pdfService: informesService,

    @InjectRepository(WorkOrder)
    private readonly workOrderRepo: Repository<WorkOrder>,
  ) {}


  @Get(':id')
  @ApiOperation({ summary: 'Generar y visualizar PDF de orden de trabajo' })
  @ApiResponse({ status: 200, description: 'PDF generado correctamente' })
  @ApiResponse({ status: 404, description: 'Orden de trabajo no encontrada' })
  async getWorkOrderPdf(@Param('id') id: number, @Res() res: Response) {
    const workOrder = await this.workOrderRepo.findOne({
      where: { id_workOrder: id },
      relations: ['truck', 'operator', 'productos'],
    });

    if (!workOrder) {
      throw new NotFoundException('Orden de trabajo no encontrada');
    }

    const pdfBuffer = await this.pdfService.generateWorkOrderPdf(workOrder);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=orden-trabajo-${workOrder.numeroOrden}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    

    return res.send(pdfBuffer);
  }

  
}
