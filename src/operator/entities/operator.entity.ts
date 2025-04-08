import { Truck } from 'src/truck/entities/truck.entity';
import { WorkOrder } from 'src/work-order/entities/work-order.entity';
import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('operator')  
export class Operator {
    @PrimaryGeneratedColumn()
    id_operator: number;

    @Column({ type: 'text' })
    nombreO: string;

    @OneToMany(() => WorkOrder, workOrder => workOrder.operator, {onDelete: 'CASCADE'})
    workOrders: WorkOrder[]; 

    @DeleteDateColumn()
    deletedAt?: Date;
}