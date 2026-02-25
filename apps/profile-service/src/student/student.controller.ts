import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateStudentDto } from './dto/create_student.dto';
import { UpdateStudentDto } from './dto/update_student.dto';
import { StudentService } from './student.service';
import { StudentEntity } from './student.entity';
import { AddressClient } from '../address.client';

@ApiTags('students')
@Controller('students')
export class StudentController {
  private readonly logger = new Logger(StudentController.name);

  constructor(
    private readonly studentService: StudentService,
    private readonly address: AddressClient,
  ) {}

  @Get()
  async list(): Promise<StudentEntity[]> {
    return this.studentService.list();
  }

  @Post()
  async create(@Body() dto: CreateStudentDto) {
    return this.studentService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateStudentDto) {
    return this.studentService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }

  @Get(':id/with-address')
  async getWithAddress(@Param('id') id: string) {
    const student = await this.studentService.getById(id);

    try {
      const addr = await this.address.get();
      return { ...student, address: addr };
    } catch (err) {
      this.logger.warn(`Address service unavailable for student [${id}]: ${err}`);
      return { ...student, address: null };
    }
  }
}
