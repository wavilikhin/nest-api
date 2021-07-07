import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    HttpCode,
    Param,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { ALREADY_REGISTERED_ERROR } from './auth.constants';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() dto: AuthDto) {
        const oldUser = await this.authService.findUser(dto.email);

        if (oldUser) {
            throw new BadRequestException(ALREADY_REGISTERED_ERROR);
        }

        return this.authService.createUser(dto);
    }

    @HttpCode(200)
    @Post('login')
    async login(@Body() dto: AuthDto) {
        const user = await this.authService.validateUser(
            dto.email,
            dto.password,
        );

        return this.authService.login(user.email);
    }

    @HttpCode(200)
    @Delete('delete/:id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        return this.authService.deleteUser(id);
    }
}
