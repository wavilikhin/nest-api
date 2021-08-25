import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getJwtConfig } from '../configs/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypegooseModule } from 'nestjs-typegoose';
import { RefreshTokenModel } from './refresh-token.model';

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getJwtConfig,
        }),
        PassportModule,
        TypegooseModule.forFeature([
            {
                typegooseClass: RefreshTokenModel,
                schemaOptions: {
                    collection: 'RefreshToken',
                },
            },
        ]),
    ],

    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
