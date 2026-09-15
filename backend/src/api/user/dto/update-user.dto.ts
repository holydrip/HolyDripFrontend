import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Name of the user (ПІБ)',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MaxLength(150, { message: 'Name is too long' })
  name?: string;

  @ApiProperty({
    description: 'Phone number of the user',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone?: string;

  @ApiProperty({
    description: 'Delivery address of the user',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Avatar URL of the user (base64 or link)',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
