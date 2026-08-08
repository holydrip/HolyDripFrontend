import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
