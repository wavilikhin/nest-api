import { IsDefined, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
    @IsDefined()
    @IsString()
    name: string;

    @IsDefined()
    @IsString()
    title: string;

    @IsDefined()
    @IsString()
    description: string;

    @IsDefined()
    @IsNumber()
    @Max(5)
    @Min(1, { message: 'Рейтинг не может быть < 1' })
    rating: number;

    @IsDefined()
    @IsString()
    productId: string;
}
