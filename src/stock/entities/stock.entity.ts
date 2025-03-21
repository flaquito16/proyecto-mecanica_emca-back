import { WorkOrder } from 'src/work-order/entities/work-order.entity';
import {
    Column,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
@Entity('stock')  
export class Stock {
    @PrimaryGeneratedColumn()
    id_stock: number;

    @Column({type: 'text'})
    nombre: string;

    @Column({type: 'text'})
    cantidad: string;

    @Column({type: 'text'})
    precio: string;

    @OneToMany(() => Stock, stock => stock.workOrder)
    workOrder: WorkOrder;

    @DeleteDateColumn()
    deletedAt?: Date;

}
