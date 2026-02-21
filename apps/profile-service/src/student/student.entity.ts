import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('student')
export class StudentEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;
}