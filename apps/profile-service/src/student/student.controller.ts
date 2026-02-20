import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateStudentDto } from './dto/create_student.dto';
import { StudentDto } from './dto/student.dto';
import { UpdateStudentDto } from './dto/update_student.dto';
import { StudentService } from './student.service';

@ApiTags('students')
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Get()
  @ApiOkResponse({ type: [StudentDto] })
  list(): StudentDto[] {
    return this.studentService.list();
  }

  @Post()
  @ApiOkResponse({ type: StudentDto })
  create(@Body() dto: CreateStudentDto): StudentDto {
    return this.studentService.create(dto);
  }

  @Put(':id')
  @ApiOkResponse({ type: StudentDto })
  update(@Param('id') id: string, @Body() dto: UpdateStudentDto): StudentDto {
    return this.studentService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Deleted' })
  remove(@Param('id') id: string): void {
    return this.studentService.remove(id);
  }
}