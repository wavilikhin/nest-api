import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsString,
    IsNumber,
    IsOptional,
    IsArray,
    ValidateNested,
} from 'class-validator';

class ProductCharacteristicDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    name: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    value: string;
}

export class CreateProductDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    image: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    title: string;

    @ApiProperty({ type: 'number', format: 'binary' })
    @IsNumber()
    price: number;

    @ApiPropertyOptional({ type: 'number', format: 'binary' })
    @IsOptional()
    @IsNumber()
    oldPrice?: number;

    @ApiProperty({ type: 'number', format: 'binary' })
    @IsNumber()
    credit: number;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    descriprion: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    advantages: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    disadvantages: string;

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    @IsArray()
    @IsString({ each: true })
    categories: string[];

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            format: 'binary',
            properties: {
                name: {
                    type: 'string',
                },
                value: {
                    type: 'string',
                },
            },
        },
    })
    @IsArray()
    @ValidateNested()
    @Type(() => ProductCharacteristicDto)
    characteristics: ProductCharacteristicDto[];
}
