import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SuccessfullLoginDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    refreshToken: string;
    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    accessToken: string;
}
