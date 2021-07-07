import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { AuthDto } from './dto/auth.dto';
import { UserModel } from './user.model';
import { genSalt, hash, compare } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @Inject(ConfigService)
        private readonly configService: ConfigService,
        @InjectModel(UserModel)
        private readonly userModel: ModelType<UserModel>,
        private readonly jwtService: JwtService,
    ) {}

    async createUser(dto: AuthDto) {
        const salt = await genSalt(10);

        const newUser = new this.userModel({
            email: dto.email,
            passwordHash: await hash(dto.password, salt),
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

        const isCorrectPassword = await compare(password, user.passwordHash);

        if (!isCorrectPassword) {
            throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
        }

        return { email: user.email };
    }

    async login(email: string) {
        const payload = { email };

        return { accessToken: await this.jwtService.signAsync(payload) };
    }

    async deleteUser(id: string) {
        if (this.configService.get('NODE_ENV') === 'test') {
            return this.userModel.findByIdAndDelete(id).exec();
        }
        return;
    }
}
