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
  
@Entity('stock')  
export class Stock {
    @PrimaryGeneratedColumn()
    id_stock: number;

    @Column({type: 'text'})
    nombre: string;

    @Column({type: 'int'})
    cantidad: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    precio: number;

    @ManyToOne(() => WorkOrder, workOrder => workOrder.productos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workOrderId' }) 
    workOrder: WorkOrder;

    @DeleteDateColumn()
    deletedAt?: Date;

}
