import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserModel } from './user.model';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        TypegooseModule.forFeature([
            {
                typegooseClass: UserModel,
                schemaOptions: {
                    collection: 'User',
                },
            },
        ]),
        AuthModule,
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
