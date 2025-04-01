import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { Repository } from 'typeorm';
import { WorkOrder } from './entities/work-order.entity';
import { Truck } from '../truck/entities/truck.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WorkOrderService {
  constructor(
    @InjectRepository(WorkOrder)
    private workOrderRepository: Repository<WorkOrder>,

    @InjectRepository(Truck)
    private truckRepository: Repository<Truck>
  ) {}

  /**
   * Genera un número de orden de trabajo único basado en la fecha y un contador secuencial.
   */
  async generateWorkOrderNumber(): Promise<string> {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  
    const lastOrder = await this.workOrderRepository.findOne({
      where: {}, // Se requiere un `where`, aunque sea vacío
      order: { id_workOrder: 'DESC' },
    });
  
    const nextNumber = lastOrder ? lastOrder.id_workOrder + 1 : 1;
    return `${date}-${String(nextNumber).padStart(3, '0')}`;
  }
  

  async create(createWorkOrderDto: CreateWorkOrderDto): Promise<WorkOrder> {
    const { truckId, fechaCierre, precioInterno, precioExterno, precioTotal, ...workOrderData } = createWorkOrderDto;
    const numeroOrden = await this.generateWorkOrderNumber();
    
    // Convertir fechas de string a Date

    const fechaCierreDate = fechaCierre || null;

    // Convertir precios de string a number
    const precioInternoNum = typeof precioInterno === 'string' ? parseFloat(precioInterno) : precioInterno;
    const precioExternoNum = typeof precioExterno === 'string' ? parseFloat(precioExterno) : precioExterno;
    const precioTotalNum = typeof precioTotal === 'string' ? parseFloat(precioTotal) : precioTotal;
    

    // Validar que el camión existe antes de asignarlo a la orden
    const truck = await this.truckRepository.findOne({ where: { id_truck: truckId } });
    if (!truck) {
      throw new NotFoundException(`Camión con ID ${truckId} no encontrado.`);
    }

    const workOrder = this.workOrderRepository.create({
      ...workOrderData,
      fechaCierre: fechaCierreDate,
      precioInterno: precioInternoNum,
      precioExterno: precioExternoNum,
      precioTotal: precioTotalNum,
      numeroOrden,
      truck,
    });

    return this.workOrderRepository.save(workOrder);
}

  
  /**
   * Obtiene el historial de órdenes de trabajo de un camión específico.
   */
  async findByTruck(truckId: number): Promise<WorkOrder[]> {
    return this.workOrderRepository.find({
      where: { truck: { id_truck: truckId } },
      relations: ['truck'], // Incluye la relación con el camión
      order: { fechaSolicitud: 'DESC' }, // Ordenado por fecha descendente
    });
  }

  /**
   * Obtiene todas las órdenes de trabajo.
   */

  findAll(): Promise<WorkOrder[]> {
    return this.workOrderRepository.find({ relations: ['truck']});
  }

  /**
   * Obtiene una orden de trabajo por ID.
   */
  
  async findOne(id_workOrder: number): Promise<WorkOrder> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id_workOrder },
      relations: ['truck'], // Incluye datos del camión en la respuesta
    });

    if (!workOrder) {
      throw new NotFoundException(`Orden de trabajo con ID ${id_workOrder} no encontrada.`);
    }

    return workOrder;
  }


  async update(id_workOrder: number, updateWorkOrderDto: UpdateWorkOrderDto) {
    try {
      console.log('ID de la orden de trabajo a actualizar:', id_workOrder);
      console.log('Datos recibidos para actualizar:', updateWorkOrderDto);
  
      // Buscar la orden de trabajo en la base de datos
      const form = await this.workOrderRepository.findOne({ where: { id_workOrder } });
  
      if (!form) {
        throw new NotFoundException(`Orden de trabajo con ID ${id_workOrder} no encontrada`);
      }
  
      // Lista de campos permitidos para actualizar
      const allowedFields = [
        'area', 'operario', 'encargado', 'responsable', 
        'prioridad', 'tipoMantenimiento', 'fechaCierre', 
        'descripcion', 'precioInterno', 'precioExterno'
      ];
  
      // Filtrar solo los campos permitidos
      const updatedData = Object.keys(updateWorkOrderDto)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateWorkOrderDto[key];
          return obj;
        }, {} as Partial<WorkOrder>);
  
      // Asignar los valores filtrados a la entidad existente
      Object.assign(form, updatedData);
  
      // Recalcular precioTotal
      const precioInterno = Number(updateWorkOrderDto.precioInterno) || form.precioInterno || 0;
      const precioExterno = Number(updateWorkOrderDto.precioExterno) || form.precioExterno || 0;
      form.precioTotal = precioInterno + precioExterno;
  
      // Guardar los cambios en la base de datos
      await this.workOrderRepository.save(form);
  
      console.log('Orden de trabajo actualizada con éxito:', form);
      return form;
    } catch (error) {
      console.error('Error en el servicio update:', error.message, error.stack);
      throw new InternalServerErrorException(`Error al actualizar: ${error.message}`);
    }
  }
  
  
   remove(id_workOrder: number) {
    this.workOrderRepository.delete({id_workOrder});
  }
}
