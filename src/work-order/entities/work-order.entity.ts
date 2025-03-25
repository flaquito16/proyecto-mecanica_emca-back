import { Stock } from 'src/stock/entities/stock.entity';
import { Truck } from 'src/truck/entities/truck.entity';
import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('work')
export class WorkOrder {
    @PrimaryGeneratedColumn()
    id_workOrder: number;

    @Column({ type: 'text' })
    area: string;

    @Column({ type: 'text' })
    operario: string;

    @Column({ type: 'text' })
    encargado: string;

    @Column({ type: 'text' })
    responsable: string;

    @Column({ type: 'text' })
    prioridad: string;

    @Column({ type: 'text' })
    tipoMantenimiento: string;

    @Column({ type: 'date' })
    fechaSolicitud: string;

    @Column({ type: 'date', nullable: true })
    fechaInicio: string;

    @Column({ type: 'date', nullable: true })
    fechaCierre: string;

    @Column({ type: 'text', unique: true })
    numeroOrden: string;

    @Column({ type: 'text' })
    descripcion: string;  

    // Relación con `Truck`
    @ManyToOne(() => Truck, truck => truck.workOrders, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'truckId' }) 
    truck: Truck;

    // Relación con `Stock`
    @OneToMany(() => Stock, stock => stock.workOrder)
    stock: Stock[];

    @DeleteDateColumn()
    deletedAt?: Date;
}
