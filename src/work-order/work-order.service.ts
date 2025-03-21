import { Injectable, NotFoundException } from '@nestjs/common';
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
  

  /**
   * Crea una nueva orden de trabajo asociada a un camión.
   */
  async create(createWorkOrderDto: CreateWorkOrderDto): Promise<WorkOrder> {
    const { truckId, ...workOrderData } = createWorkOrderDto;
    const numeroOrden = await this.generateWorkOrderNumber();

    // Validar que el camión existe antes de asignarlo a la orden
    const truck = await this.truckRepository.findOne({ where: { id_truck: truckId } });
    if (!truck) {
      throw new NotFoundException(`Camión con ID ${truckId} no encontrado.`);
    }

    const workOrder = this.workOrderRepository.create({
      ...workOrderData,
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
    return this.workOrderRepository.find({ relations: ['truck'] });
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

  /**
   * Actualiza una orden de trabajo por ID.
   */
  async update(id_workOrder: number, updateWorkOrderDto: UpdateWorkOrderDto) {
    await this.workOrderRepository.update({ id_workOrder }, updateWorkOrderDto);
    return this.findOne(id_workOrder);
  }

  /**
   * Elimina una orden de trabajo por ID.
   */
  async remove(id_workOrder: number) {
    const workOrder = await this.findOne(id_workOrder);
    await this.workOrderRepository.remove(workOrder);
  }
}
