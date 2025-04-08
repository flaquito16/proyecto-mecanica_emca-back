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
        console.log('ID de la orden de trabajo a actualizar:', id_workOrder);
        console.log('Datos recibidos para actualizar:', updateWorkOrderDto);

        // Buscar la orden de trabajo actual con sus productos
        const workOrder = await this.workOrderRepository.findOne({
            where: { id_workOrder },
            relations: ['productos'], // Asegurar que se traen los productos relacionados
        });

        if (!workOrder) {
            throw new NotFoundException(`Orden de trabajo con ID ${id_workOrder} no encontrada`);
        }

        // Cargar los productos de la orden actual y mapearlos por ID
        const currentStockMap = new Map<number, Stock>(
            workOrder.productos.map(product => [product.id_stock, product])
        );

        // Procesar los productos enviados en el DTO (evitando error si no hay productos)
        if (updateWorkOrderDto.productos && updateWorkOrderDto.productos.length > 0) {
            for (const updatedProduct of updateWorkOrderDto.productos) {
                const { id_stock, cantidad, precio } = updatedProduct;
                
                // Buscar el stock en la base de datos
                const stock = await this.stockRepository.findOne({ where: { id_stock } });

                if (!stock) {
                    throw new NotFoundException(`Producto con ID ${id_stock} no encontrado`);
                }

                // Si el producto ya estaba en la orden, calcular la diferencia de cantidad
                const oldProduct = currentStockMap.get(id_stock);
                if (oldProduct) {
                    const cantidadDiferencia = cantidad - oldProduct.cantidad;
                    stock.cantidad -= cantidadDiferencia; // Ajustar cantidad en stock
                } else {
                    stock.cantidad -= cantidad; // Restar la nueva cantidad directamente
                }
                // Actualizar precio unitario si se envió en la actualización
                if (precio) {
                    stock.precio = precio;
                }

                await this.stockRepository.save(stock); // Guardar cambios en stock
            }
        }

        // Lista de campos permitidos para actualizar en WorkOrder
        const allowedFields = [
            'area', 'encargado', 'responsable', 
            'prioridad', 'tipoMantenimiento', 'fechaCierre', 
            'precio', 'precioInterno', 'precioExterno'
        ];

        // Filtrar solo los campos permitidos
        const updatedData = Object.keys(updateWorkOrderDto)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = updateWorkOrderDto[key];
                return obj;
            }, {} as Partial<WorkOrder>);

        // Asignar los valores filtrados a la entidad existente
        Object.assign(workOrder, updatedData);

        // Recalcular precioTotal
        const precioInterno = Number(updateWorkOrderDto.precioInterno) || workOrder.precioInterno || 0;
        const precioExterno = Number(updateWorkOrderDto.precioExterno) || workOrder.precioExterno || 0;

        // Calcular precio total sumando los precios internos, externos y el costo de productos
        const precioProductos = workOrder.productos.reduce((total, producto) => {
            return total + (producto.cantidad * producto.precio);
        }, 0);

        workOrder.precioTotal = precioInterno + precioExterno + precioProductos;

        // Guardar la orden de trabajo actualizada
        await this.workOrderRepository.save(workOrder);

        console.log('Orden de trabajo actualizada con éxito:', workOrder);
        return workOrder;
    } catch (error) {
        console.error('Error en el servicio update:', error.message, error.stack);
        throw new InternalServerErrorException(`Error al actualizar: ${error.message}`);
    }
}

   remove(id_workOrder: number) {
    this.workOrderRepository.delete({id_workOrder});
  }
}
