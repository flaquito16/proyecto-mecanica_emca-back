import { WorkOrder } from 'src/work-order/entities/work-order.entity';
import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('truck')  
export class Truck {
    @PrimaryGeneratedColumn()
    id_truck: number;
  
    @Column({ type: 'text' })
    codigo_maquina: string;

    @Column({ type: 'text' })
    nombre_maquina: string;

    @Column({ type: 'text' })
    codigo_seccion: string;

    @Column({ type: 'text' })
    nombre_seccion: string;

    @Column({ type: 'text' })
    marca: string;

    @Column({ type: 'text' })
    linea: string;

    @Column({ type: 'text' })
    fecha_fabricacion: string;

    @Column({ type: 'text' })
    comprado: string;

    @Column({ type: 'text' })
    modelo: string;

    @Column({ type: 'text' })
    capacidad_produccion: string;

    @Column({ type: 'text' })
    pais_origen: string;

    @Column({ type: 'text' })
    fabricado: string;

    @Column({ type: 'text' })
    fecha_instalacion: string;

    @Column({ type: 'text' })
    numero_serie: string;

    // Relación correcta con WorkOrder
    @OneToMany(() => WorkOrder, workOrder => workOrder.truck)
    @JoinColumn({ name: 'historial' })
    workOrders: WorkOrder[];

    @DeleteDateColumn()
    deletedAt?: Date;
}
// Compare this snippet from src/truck/dto/update-truck.dto.ts:
// import { PartialType } from '@nestjs/mapped-types';