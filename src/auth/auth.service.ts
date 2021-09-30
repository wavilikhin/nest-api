import { Injectable, NotFoundException } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { nanoid } from 'nanoid';
import { InjectModel } from 'nestjs-typegoose';
import { RefreshTokenModel } from './refresh-token.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { Types } from 'mongoose';
import { RefreshTokenDto } from 'src/user/dto/refresh-token.dto';
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectModel(RefreshTokenModel)
        private readonly refreshTokenModel: ModelType<RefreshTokenModel>,
    ) {}

    async genSalt(round: number = 10) {
        const salt = await genSalt(round);
        return salt;
    }

    async hashPassword(password: string, salt: string) {
        const passwordHash = await hash(password, salt);
        return passwordHash;
    }

    async comparePasswords(password: string, passwordHash: string) {
        const isCorrectPassword = await compare(password, passwordHash);
        return isCorrectPassword;
    }

    async login(_id: Types.ObjectId) {
        const payload = { _id };

        const refreshToken = nanoid();

        const refreshTokenModel = new this.refreshTokenModel({
            userId: _id,
            refreshToken,
        });

        await refreshTokenModel.save();

        return {
            accessToken: await this.jwtService.signAsync(payload),
            refreshToken,
        };
    }

    async refresh(dto: RefreshTokenDto) {
        const dbToken = await this.refreshTokenModel
            .findOne({ refreshToken: dto.refreshToken })
            .exec();

        if (!dbToken) {
            throw new NotFoundException('Token not found');
        }

        const newTokens = await this.login(dbToken.userId);

        await dbToken.remove();

        return newTokens;
    }

    async logout(id: string) {
        await this.refreshTokenModel
            .deleteMany({ userId: Types.ObjectId(id) })
            .exec();
        return;
    }
}
