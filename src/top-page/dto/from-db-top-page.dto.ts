import { ApiProperty } from '@nestjs/swagger';
import { CreateTopPageDto } from './create-top-page.dto';

export class FromDbTopPageDto extends CreateTopPageDto {
    @ApiProperty({ type: 'number', format: 'binary' })
    __v: number;

    @ApiProperty({ type: 'string', format: 'binary' })
    _id: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    createdAt: Date;

    @ApiProperty({ type: 'string', format: 'binary' })
    updatedAt: Date;
}
