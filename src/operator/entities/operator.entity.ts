import { Truck } from 'src/truck/entities/truck.entity';
import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('operator')  
export class Operator {
    @PrimaryGeneratedColumn()
    id_operator: number;

    @Column({ type: 'text' })
    nombre_operario: string;

    @ManyToOne(() => Truck, truck => truck.operators, {onDelete: 'CASCADE'})
    @JoinColumn({name : 'truckId'})
    truck: Truck;

    @DeleteDateColumn()
    deletedAt?: Date;
}