import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'syscode',
      password: 'syscode',
      database: 'syscode',
      autoLoadEntities: true,
      synchronize: false,
    }),
    StudentModule,
  ],
})
export class AppModule {}
