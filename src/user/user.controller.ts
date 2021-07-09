import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    HttpCode,
    Inject,
    Param,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { ALREADY_REGISTERED_ERROR } from './constants/user.constants';
import { CreateUserDto } from './dto/create-user.dto';
import { TestEnvGuard } from './guards/test-env.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        @Inject(AuthService) private readonly authService: AuthService,
        @Inject(UserService) private readonly userService: UserService,
    ) {}

    @UsePipes(new ValidationPipe())
    @HttpCode(201)
    @Post('register')
    async register(@Body() dto: CreateUserDto) {
        const oldUser = await this.userService.findUser(dto.email);

        if (oldUser) {
            throw new BadRequestException(ALREADY_REGISTERED_ERROR);
        }

        return this.userService.createUser(dto);
    }

    @HttpCode(200)
    @Post('login')
    async login(@Body() dto: CreateUserDto) {
        const user = await this.userService.validateUser(
            dto.email,
            dto.password,
        );

        return this.authService.login(user.email);
    }

    @UseGuards(TestEnvGuard)
    @HttpCode(200)
    @Delete('delete/:id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        return this.userService.deleteUser(id);
    }
}
