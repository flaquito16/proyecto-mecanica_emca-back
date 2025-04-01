import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Truck } from './entities/truck.entity';
import { log } from 'console';

@Injectable()
export class TruckService {
  constructor(
    @InjectRepository(Truck)
    private truckRepository: Repository<Truck>
  ) {}
  create(createTruckDto: CreateTruckDto) {
    return this.truckRepository.save(createTruckDto);
  }

  findAll() {
    return this.truckRepository.find({
      relations: ['workOrders']
    });
  }

  findOne(id_truck: number) {
    return this.truckRepository.findOneBy({id_truck});
  }

  async findById(id_truck: number): Promise<Truck> {
    return await this.truckRepository.findOne({
        where: { id_truck },
        relations: ['workOrders'], // Cargar las órdenes de trabajo relacionadas
    });
}


 async update(id_truck: number, updateTruckDto: UpdateTruckDto) {
  try {
    console.log('Id de los camiones a actualizar: ', id_truck);
    console.log('Datos recibidos para actualizar:', updateTruckDto);
    
    const form = await this.truckRepository.findOne({where: {id_truck}})

    if (!form) {
      throw new NotFoundException(`El camion con ID ${id_truck} no encontrada.`)
    }

    const dates = [
      'codigo_maquina', 'nombre_maquina', 'codigo_seccion', 'nombre_seccion',
      'marca','linea', 'fecha_fabricacion', 'comprado', 'modelo', 'capaciddad_produccion',
      'pais_origen', 'fabricado', 'fecha_instalacion', 'numero_serie'
    ];

    const updateDate = Object.keys(updateTruckDto)
      .filter(key => dates.includes(key))
      .reduce((obje, key) => {
        obje[key] = updateTruckDto[key];
        return obje;
    }, {} as Partial<Truck>);

    Object.assign(form, updateDate)
    
    await this.truckRepository.save(form);

    console.log('Camion actualizado con exito: ', form);
    return form;
  } catch (error) {
      console.error('Error en el servicio update:', error.message, error.stack);
      throw new InternalServerErrorException(`Error al actualizar: ${error.message}`);
  }
}

  remove(id_truck: number) {
    return this.truckRepository.softRemove({id_truck});
  }

  async findAllWithWorkOrders(): Promise<Truck[]> {
    return this.truckRepository.find({ relations: ['workOrders'] });
  }

  /**
   * Obtiene un camión por ID con su historial de órdenes de trabajo
   */
  async findOneWithWorkOrders(id: number): Promise<Truck> {
    return this.truckRepository.findOne({
      where: { id_truck: id },
      relations: ['workOrders'],
    });
  }
}
