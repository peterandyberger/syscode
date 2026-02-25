import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateStudentDto } from './dto/create_student.dto';
import { UpdateStudentDto } from './dto/update_student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentEntity } from './student.entity';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(
    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
  ) {}

  async list(): Promise<StudentEntity[]> {
    return this.studentRepository.find();
  }

  async create(dto: CreateStudentDto): Promise<StudentEntity> {
    const student = this.studentRepository.create({
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
    });

    const saved = await this.studentRepository.save(student);
    this.logger.log(`Student created [${saved.id}]`);
    return saved;
  }

  async update(id: string, dto: UpdateStudentDto): Promise<StudentEntity> {
    const student = await this.studentRepository.findOneBy({ id });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    student.name = dto.name ?? student.name;
    student.email = dto.email ?? student.email;

    return this.studentRepository.save(student);
  }

  async remove(id: string): Promise<void> {
    const result = await this.studentRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Student not found');
    }

    this.logger.log(`Student removed [${id}]`);
  }

  async getById(id: string): Promise<StudentEntity> {
    const student = await this.studentRepository.findOneBy({ id });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }
}
