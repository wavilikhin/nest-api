import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    @IsString()
    refreshToken: string;
}
