import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('student')
export class StudentEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;
}