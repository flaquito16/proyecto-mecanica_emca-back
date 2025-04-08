import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { Repository } from 'typeorm';
import { WorkOrder } from './entities/work-order.entity';
import { Truck } from '../truck/entities/truck.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Stock } from 'src/stock/entities/stock.entity';
import { Operator } from 'src/operator/entities/operator.entity';

@Injectable()
export class WorkOrderService {
  constructor(
    @InjectRepository(WorkOrder)
    private workOrderRepository: Repository<WorkOrder>,

    @InjectRepository(Truck)
    private truckRepository: Repository<Truck>,

    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,

    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>
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
    const { truckId, operatorId, fechaCierre, precioInterno, precioExterno, precioTotal, ...workOrderData } = createWorkOrderDto;
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
    const operator = await this.operatorRepository.findOne({ where: { id_operator: operatorId } });
    if (!operator) {
      throw new NotFoundException(`Operador con ID ${operatorId} no encontrado.`);
    }

    const workOrder = this.workOrderRepository.create({
      ...workOrderData,
      fechaCierre: fechaCierreDate,
      precioInterno: precioInternoNum,
      precioExterno: precioExternoNum,
      precioTotal: precioTotalNum,
      numeroOrden,
      truck,
      operator,
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


  async findByStock(id_stock: number): Promise<WorkOrder[]>{
    return this.workOrderRepository.find({
      where: {productos: {id_stock: id_stock}},
      relations: ['productos'],
    });
  } 

 /**
  * Obtiene todas las órdenes de trabajo.
  */
 findAll(): Promise<WorkOrder[]> {
    return this.workOrderRepository.find({ relations: ['truck', 'productos', 'operator'] });
  }

  /**
   * Obtiene una orden de trabajo por ID.
   */
  
  findOne(id_workOrder: number) {
    return this.workOrderRepository.findOneBy({id_workOrder})
  }

  
  async findById(id_workOrder: number): Promise<WorkOrder> {
    return await this.workOrderRepository.findOne({
        where: { id_workOrder },
        relations: ['truck', 'operator', 'productos'], // Cargar las órdenes de trabajo relacionadas
    });
}

  async findByOperator(operatorId: number): Promise<WorkOrder[]> {
    return this.workOrderRepository.find({
      where: { operator: { id_operator: operatorId } },
      relations: ['operator'], // Incluye la relación con el operador
      order: { fechaSolicitud: 'DESC' }, // Ordenado por fecha descendente
    });
  }

  async update(id_workOrder: number, updateWorkOrderDto: UpdateWorkOrderDto) {
    try {
      const workOrder = await this.workOrderRepository.findOne({
        where: { id_workOrder },
        relations: ['productos'],
      });
  
      if (!workOrder) {
        throw new NotFoundException(`Orden de trabajo con ID ${id_workOrder} no encontrada`);
      }
  
      // 1. Devolver al stock los productos actuales
      for (const oldProduct of workOrder.productos) {
        const stock = await this.stockRepository.findOne({ where: { id_stock: oldProduct.id_stock } });
        if (stock) {
          stock.cantidad += oldProduct.cantidad;
          await this.stockRepository.save(stock);
        }
      }
  
      // 2. Limpiar los productos actuales de la orden
      workOrder.productos = [];
  
      const nuevosProductos: Stock[] = [];
  
      if (updateWorkOrderDto.productos && updateWorkOrderDto.productos.length > 0) {
        for (const updatedProduct of updateWorkOrderDto.productos) {
          const { id_stock, cantidad, precio } = updatedProduct;
  
          const stock = await this.stockRepository.findOne({ where: { id_stock } });
          if (!stock) {
            throw new NotFoundException(`Producto con ID ${id_stock} no encontrado`);
          }
  
          // Restar nueva cantidad
          if (stock.cantidad < cantidad) {
            throw new InternalServerErrorException(
              `Stock insuficiente para el producto ${stock.nombre || id_stock}`
            );
          }
  
          stock.cantidad -= cantidad;
          stock.precio = precio; // Puedes controlar esto si no quieres que siempre se actualice
          await this.stockRepository.save(stock);
  
          // Construir nuevo producto para la orden
          const nuevoProducto = {
            ...stock,
            cantidad,
            precio,
          };
          nuevosProductos.push(nuevoProducto as Stock);
        }
      }
  
      workOrder.productos = nuevosProductos;
      // 3. Actualizar otros campos permitidos
      const allowedFields = [
        'area', 'encargado', 'responsable',
        'prioridad', 'tipoMantenimiento', 'fechaCierre',
        'precioInterno', 'precioExterno', 'productos'
      ];
  
      for (const key of allowedFields) {
        if (key in updateWorkOrderDto) {
          (workOrder as any)[key] = updateWorkOrderDto[key];
        }
      }
  
      // 4. Recalcular precioTotal
      const precioInterno = Number(workOrder.precioInterno) || 0;
      const precioExterno = Number(workOrder.precioExterno) || 0;
      const precioProductos = nuevosProductos.reduce((total, producto) => {
        return total + (producto.cantidad * producto.precio);
      }, 0);
  
      workOrder.precioTotal = precioInterno + precioExterno + precioProductos;
  
      // 5. Guardar orden de trabajo
      await this.workOrderRepository.save(workOrder);
      return workOrder;
  
    } catch (error) {
      console.error('Error en el servicio update:', error.message);
      throw new InternalServerErrorException(`Error al actualizar: ${error.message}`);
    }
  }
  
   remove(id_workOrder: number) {
    this.workOrderRepository.delete({id_workOrder});
  }
}
