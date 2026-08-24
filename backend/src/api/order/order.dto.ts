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
    image?: string;
}
export class CreateOrderDto {
    @IsString()
    @IsNotEmpty({ message: 'Имя не может быть пустым' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'Телефон обязателен' })
    phone: string;

    @IsString()
    @IsNotEmpty({ message: 'Телеграм не может быть пустым' })
    telegram: string;

    @IsString()
    address?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsNumber()
    @IsNotEmpty()
    totalPrice: number;

    @IsString()
    @IsOptional()
    paymentMethod?: string;
}