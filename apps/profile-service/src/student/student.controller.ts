import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateStudentDto } from './dto/create_student.dto';
import { UpdateStudentDto } from './dto/update_student.dto';
import { StudentService } from './student.service';
import { StudentEntity } from './student.entity';

@ApiTags('students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

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
}
