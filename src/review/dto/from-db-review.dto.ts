import { ApiProperty } from '@nestjs/swagger';
import { CreateReviewDto } from './create-review.dto';

export class FromDbReviewDto extends CreateReviewDto {
    @ApiProperty({ type: 'number', format: 'binary' })
    __v: number;

    @ApiProperty({ type: 'string', format: 'binary' })
    _id: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    createdAt: Date;

    @ApiProperty({ type: 'string', format: 'binary' })
    updatedAt: Date;
}
