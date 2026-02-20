import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Peter Berger' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'peter@example.com' })
  @IsEmail()
  email!: string;
}