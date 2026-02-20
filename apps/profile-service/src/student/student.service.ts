import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateStudentDto } from './dto/create_student.dto';
import { StudentDto } from './dto/student.dto';
import { UpdateStudentDto } from './dto/update_student.dto';

@Injectable()
export class StudentService {
  private readonly students = new Map<string, StudentDto>();

  list(): StudentDto[] {
    return Array.from(this.students.values());
  }

  create(dto: CreateStudentDto): StudentDto {
    const id = randomUUID();
    const student: StudentDto = { id, name: dto.name, email: dto.email };
    this.students.set(id, student);
    return student;
  }

  update(id: string, dto: UpdateStudentDto): StudentDto {
    const existing = this.students.get(id);
    if (!existing) throw new NotFoundException('Student not found');

    const updated: StudentDto = {
      ...existing,
      name: dto.name ?? existing.name,
      email: dto.email ?? existing.email,
    };

    this.students.set(id, updated);
    return updated;
  }

  remove(id: string): void {
    const existed = this.students.delete(id);
    if (!existed) throw new NotFoundException('Student not found');
  }
}