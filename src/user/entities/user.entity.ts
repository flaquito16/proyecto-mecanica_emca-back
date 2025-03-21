import {
    Column,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
@Entity('user')  
export class User {
  @PrimaryGeneratedColumn()
    id_usuario: number;
  
    @Column()
    nombre: string;
  
    @Column()
    apellido: string;
  
    @Column({ unique: true, nullable: false })
    correo: string;
    
    @Column({ nullable: false })
    contraseña: string;

    @DeleteDateColumn()
    deletedAt?: Date;
}
