import { prop } from '@typegoose/typegoose';
import { Types } from 'mongoose';

export class RefreshTokenModel {
    @prop()
    userId: Types.ObjectId;

    @prop()
    refreshToken: string;
}
