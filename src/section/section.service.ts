import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from './entities/section.entity';
import { Repository } from 'typeorm';
import { Truck } from 'src/truck/entities/truck.entity';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,

     @InjectRepository(Truck)
      private truckRepository: Repository<Truck>,
  ) {}

  async create(createSectionDto: CreateSectionDto): Promise<Section> {
    const { truckId, ...sectionData } = createSectionDto;

    const truck = await this.truckRepository.findOne({ where: { id_truck: truckId } });
    if (!truck) {
      throw new Error(`Camión con ID ${truckId} no encontrado.`);
    }
    const sections = this.sectionRepository.create({
      ...sectionData,
      truck,
    });
    return this.sectionRepository.save(sections);

  }

  findAll(): Promise<Section[]> {
    return  this.sectionRepository.find({relations: ['truck']}); // Incluye la relación con el camión
  }

    async findByTruck(truckId: number): Promise<Section[]> {
      return this.sectionRepository.find({
        where: { truck: { id_truck: truckId } },
        relations: ['truck'], // Incluye la relación con el camión
        // Ordenado por fecha descendente
      });
    }

 async findOne(id_section: number): Promise<Section> {
    const section = await this.sectionRepository.findOne({
      where: { id_section },
      relations: ['truck'], // Incluye datos del camión en la respuesta
    });
    if (!section) {
      throw new Error(`Sección con ID ${id_section} no encontrada.`);
    }
    return section;
  }

  update(id_section: number, updateSectionDto: UpdateSectionDto) {
    return this.sectionRepository.update({id_section}, updateSectionDto);
  }

  remove(id_section: number) {
    return this.sectionRepository.softRemove({id_section});
  }
}
