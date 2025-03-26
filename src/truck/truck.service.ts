import { Injectable } from '@nestjs/common';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Truck } from './entities/truck.entity';

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


  update(id_truck: number, updateTruckDto: UpdateTruckDto) {
    return this.truckRepository.update({id_truck}, updateTruckDto);
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
