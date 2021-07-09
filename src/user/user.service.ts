import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
    USER_NOT_FOUND_ERROR,
    WRONG_PASSWORD_ERROR,
} from './constants/user.constants';

@Injectable()
export class UserService {
    constructor(
        @Inject(AuthService) private readonly authService: AuthService,
        @InjectModel(UserModel)
        private readonly userModel: ModelType<UserModel>,
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) {}

    async createUser(dto: CreateUserDto) {
        const salt = await this.authService.genSalt(10);

        const newUser = new this.userModel({
            email: dto.email,
            passwordHash: await this.authService.hashPassword(
                dto.password,
                salt,
            ),
        });

        return newUser.save();
    }

    async findUser(email: string) {
        return this.userModel.findOne({ email }).exec();
    }

    async validateUser(
        email: string,
        password: string,
    ): Promise<Pick<UserModel, 'email'>> {
        const user = await this.findUser(email);

        if (!user) {
            throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
        }

        const isCorrectPassword = await this.authService.comparePasswords(
            password,
            user.passwordHash,
        );

        if (!isCorrectPassword) {
            throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
        }

        return { email: user.email };
    }

    async deleteUser(id: string) {
        if (this.configService.get('NODE_ENV') === 'test') {
            return this.userModel.findByIdAndDelete(id).exec();
        }
        return;
    }
}
