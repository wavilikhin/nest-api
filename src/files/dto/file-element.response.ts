import { ApiProperty } from '@nestjs/swagger';

export class FileElementRespose {
    @ApiProperty({ type: 'string', format: 'binary' })
    url: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    name: string;
}
