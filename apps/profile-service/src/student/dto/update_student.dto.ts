import { PartialType } from '@nestjs/swagger';
import { CreateStudentDto } from './create_student.dto';

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}