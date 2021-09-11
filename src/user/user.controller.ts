import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    HttpCode,
    Inject,
    Param,
    Post,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AuthService } from '../auth/auth.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { ALREADY_REGISTERED_ERROR } from './constants/user.constants';
import { CreateUserDto } from './dto/create-user.dto';
import { TestEnvGuard } from './guards/test-env.guard';
import { UserService } from './user.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserId } from '../decorators/user-id.decorator';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SuccessfullLoginDto } from './dto/successfull-login-dto';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(
        @Inject(AuthService) private readonly authService: AuthService,
        @Inject(UserService) private readonly userService: UserService,
    ) {}

    @ApiOperation({ summary: 'Create new user' })
    @ApiCreatedResponse({
        description: 'Created user',
    })
    @ApiBadRequestResponse({
        description: 'User already exists or provided data is invalid',
    })
    @ApiInternalServerErrorResponse({ description: 'Unknown server error' })
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

    @ApiOperation({ summary: 'Login user' })
    @ApiOkResponse({
        description: 'User successfully logged in',
        type: SuccessfullLoginDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid data provided',
    })
    @ApiForbiddenResponse({
        description: 'User with provided email doesn\'t exist',
    })
    @ApiInternalServerErrorResponse({ description: 'Unknown server error' })
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    @Post('login')
    async login(@Body() dto: CreateUserDto) {
        const user = await this.userService.validateUser(
            dto.email,
            dto.password,
        );

        return this.authService.login(user._id);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Logout user' })
    @ApiOkResponse({
        description: 'User successfully logged out',
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid jwt token provided',
    })
    @ApiInternalServerErrorResponse({ description: 'Unknown server error' })
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @Post('logout')
    async logout(@UserId() userId: string) {
        return this.authService.logout(userId);
    }

    // @ApiBearerAuth()
    // @UseGuards(TestEnvGuard)
    // @HttpCode(200)
    // @Delete('delete/:id')
    // async delete(@Param('id', IdValidationPipe) id: string) {
    //     return this.userService.deleteUser(id);
    // }

    @ApiOperation({ summary: 'Update tokens using refresh token' })
    @ApiOkResponse({
        description: 'Tokens successfully updated',
        type: SuccessfullLoginDto,
    })
    @ApiNotFoundResponse({
        description: 'Refresh token not found',
    })
    @ApiInternalServerErrorResponse({ description: 'Unknown server error' })
    @HttpCode(200)
    @Post('refresh')
    async refresh(@Body() dto: RefreshTokenDto) {
        return this.authService.refresh(dto);
    }
}
