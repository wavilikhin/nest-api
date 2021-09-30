import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Types } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpired: false,
            secretOrKey: configService.get('JWT_SECRET'),
            jsonWebTokenOptions: {
                maxAge: configService.get('JWT_EXPIRATION_TIME'),
            },
        });
    }

    async validate(payload: { _id: Types.ObjectId }) {
        return payload._id;
    }
}
