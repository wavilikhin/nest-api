import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    @IsNotEmpty()
    @IsString()
    email: string;

    @ApiProperty({ type: 'string', format: 'binary' })
    @IsNotEmpty()
    @IsString()
    password: string;
}
