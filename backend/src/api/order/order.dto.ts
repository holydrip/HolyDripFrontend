import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    size: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsString()
    @IsOptional()
    image?: string;
}

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty({ message: 'Імʼя не може бути пустим' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'Телефон обовʼязковий' })
    phone: string;

    @IsString()
    @IsNotEmpty({ message: 'Telegram не може бути пустим' })
    telegram: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsNumber()
    @IsNotEmpty()
    totalPrice: number;
}