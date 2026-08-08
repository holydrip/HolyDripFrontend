import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Name of the user',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name of the user should be a string' })
  @MinLength(3, { message: 'Name of the user is too short' })
  @MaxLength(50, { message: 'Name of the user is too long' })
  name: string;

  @ApiProperty({
    description: 'Phone number of the user',
  })
  @IsPhoneNumber('UA', { message: 'Phone number is incorrect' })
  
  phone?: string;
  @ApiProperty({
    description: 'Email of the user',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'Password of the user',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password is incorrect' })
  @MinLength(3, { message: 'Password is too short' })
  @MaxLength(50, { message: 'Password is too long' })
  password: string;
}
