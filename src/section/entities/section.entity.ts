import {
    Column,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
@Entity('section')  
export class Section {
    @PrimaryGeneratedColumn()
    id_section: number;

    @Column({type: 'text'})
    nombre_seccion: string;

    @DeleteDateColumn()
    deletedAt?: Date;
}
