import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { TopLevelCategory } from '../top-page.model';

export class FindTopPageDto {
    @ApiProperty({
        type: 'number',
        format: 'binary',
        enum: TopLevelCategory,
        enumName: 'Top level category',
        example: { firstCategory: 0 },
    })
    @IsEnum(TopLevelCategory)
    firstCategory: TopLevelCategory;
}
