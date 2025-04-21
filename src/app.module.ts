import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { TruckModule } from './truck/truck.module';
import { Truck } from './truck/entities/truck.entity';
import { WorkOrderModule } from './work-order/work-order.module';
import { WorkOrder } from './work-order/entities/work-order.entity';
import { StockModule } from './stock/stock.module';
import { Stock } from './stock/entities/stock.entity';
import { SectionModule } from './section/section.module';
import { Section } from './section/entities/section.entity';
import { OperatorModule } from './operator/operator.module';
import { Operator } from './operator/entities/operator.entity';
import { informesModule } from './Informes/informes.module';


@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',      // Host del servidor MySQL (XAMPP corre en localhost)
    port: 3306,             // Puerto de MySQL (el puerto de XAMPP por defecto es 3306)
    username: 'root',       // El usuario por defecto de XAMPP es 'root'
    password: '',           // La contraseña por defecto de XAMPP es vacía
    database: 'mecanica',       // Nombre de la base de datos que creaste en phpMyAdmin
    entities: [
      User, 
      Truck,
      WorkOrder,
      Stock,
      Section,
      Operator // aqui si agregas una tabla nuevo en el back tienes que meter el nombre de esa tabla aca, ya que si no se ingresa no se creara
    ],       // Asegúrate de que la entidad está importada
    synchronize: true,      // Solo para desarrollo, sincroniza automáticamente las tablas con las entidades
  }), 
  UserModule, 
  AuthModule, 
  TruckModule, 
  WorkOrderModule, 
  StockModule, 
  SectionModule, 
  OperatorModule,
  informesModule,
],
  controllers: [],
  providers: [],
})
export class AppModule {}
