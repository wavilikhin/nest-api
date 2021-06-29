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
    @IsEnum(TopLevelCategory)
    firstCategory: TopLevelCategory;

    @IsString()
    secondCategory: string;

    @IsString()
    alias: string;

    @IsString()
    title: string;

    @IsString()
    category: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => HhData)
    hh?: HhData;

    @IsArray()
    @ValidateNested()
    @Type(() => TopPageAdvantage)
    advantages: TopPageAdvantage[];

    @IsString()
    seoText: string;

    @IsString()
    tagsTitle: string;

    @IsArray()
    @IsString({ each: true })
    tags: string[];
}
