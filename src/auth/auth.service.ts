import { Injectable } from '@nestjs/common';
import { genSalt, hash, compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

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

    async login(email: string) {
        const payload = { email };

        return { accessToken: await this.jwtService.signAsync(payload) };
    }
}
