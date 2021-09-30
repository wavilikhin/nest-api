import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    @IsDefined()
    @IsString()
    name: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsDefined()
    @IsString()
    title: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsDefined()
    @IsString()
    description: string;

    @ApiProperty({ type: 'number', format: 'binary', maximum: 5, minimum: 1 })
    @IsDefined()
    @IsNumber()
    @Max(5)
    @Min(1, { message: 'Рейтинг не может быть < 1' })
    rating: number;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsDefined()
    @IsString()
    productId: string;
}
