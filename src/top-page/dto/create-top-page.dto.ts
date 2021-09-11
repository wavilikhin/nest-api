import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsNumber,
    IsString,
    IsOptional,
    IsEnum,
    ValidateNested,
} from 'class-validator';

export enum TopLevelCategory {
    Courses,
    Services,
    Books,
    Products,
}

class HhData {
    @IsNumber()
    count: number;

    @IsNumber()
    juniorSalary: number;

    @IsNumber()
    middleSalary: number;

    @IsNumber()
    seniorSalary: number;
}

class TopPageAdvantage {
    @IsString()
    title: string;

    @IsString()
    description: string;
}

export class CreateTopPageDto {
    @ApiProperty({ enum: ['Courses', 'Services', 'Books', 'Products'] })
    @IsEnum(TopLevelCategory)
    firstCategory: TopLevelCategory;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    secondCategory: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    alias: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    title: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    category: string;

    @ApiPropertyOptional({
        type: 'object',
        format: 'binary',
        properties: {
            count: {
                type: 'number',
            },
            juniorSalary: {
                type: 'number',
            },
            middleSalary: {
                type: 'number',
            },
            seniorSalary: {
                type: 'number',
            },
        },
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => HhData)
    hh?: HhData;

    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            format: 'binary',
            properties: {
                title: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
            },
        },
    })
    @IsArray()
    @ValidateNested()
    @Type(() => TopPageAdvantage)
    advantages: TopPageAdvantage[];

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    seoText: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    tagsTitle: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsArray()
    @IsString({ each: true })
    tags: string[];
}
