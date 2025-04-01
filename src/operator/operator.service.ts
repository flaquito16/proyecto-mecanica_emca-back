import { Injectable } from '@nestjs/common';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Operator } from './entities/operator.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OperatorService {
  constructor(
    @InjectRepository(Operator)
    private operatorRepository : Repository<Operator>
  ){}

  create(createOperatorDto: CreateOperatorDto) {
    return this.operatorRepository.save(createOperatorDto);
  }

  findAll() {
    return this.operatorRepository.find();
  }

  findOne(id_operator: number) {
    return this.operatorRepository.findOneBy({id_operator});
  }

  update(id_operator: number, updateOperatorDto: UpdateOperatorDto) {
    return this.operatorRepository.update({id_operator}, updateOperatorDto);
  }

  remove(id_operator: number) {
    return this.operatorRepository.softRemove({id_operator});
  }
}
