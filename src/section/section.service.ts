import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from './entities/section.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SectionService {
  constructor(
    @InjectRepository(Section)
    private sectionRepository: Repository<Section>
  ) {}
  create(createSectionDto: CreateSectionDto) {
    return this.sectionRepository.save(createSectionDto);
  }

  findAll() {
    return  this.sectionRepository.find();
  }

  findOne(id_section: number) {
    return this.sectionRepository.findOneBy({id_section});
  }

  update(id_section: number, updateSectionDto: UpdateSectionDto) {
    return this.sectionRepository.update({id_section}, updateSectionDto);
  }

  remove(id_section: number) {
    return this.sectionRepository.softRemove({id_section});
  }
}
