import { ApiProperty } from '@nestjs/swagger';

export class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    // tslint:disable-next-line: no-any
    files: any;
}
