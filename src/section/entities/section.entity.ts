import { Truck } from 'src/truck/entities/truck.entity';
import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
@Entity('section')  
export class Section {
    @PrimaryGeneratedColumn()
    id_section: number;

    @Column({type: 'text'})
    codigo: string;

    @Column({type: 'text'})
    nombre: string;

    @ManyToOne(() => Truck, truck => truck.sections, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'truckId' }) 
    truck: Truck;

    @DeleteDateColumn()
    deletedAt?: Date;
}
