import { ApiProperty } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class FromDbProductDto extends CreateProductDto {
    @ApiProperty({ type: 'number', format: 'binary' })
    __v: number;

    @ApiProperty({ type: 'string', format: 'binary' })
    _id: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    createdAt: Date;

    @ApiProperty({ type: 'string', format: 'binary' })
    updatedAt: Date;
}
