import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class FindProductDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    category: string;

    @ApiProperty({ type: 'number', format: 'binary' })
    @IsNumber()
    limit: number;
}
