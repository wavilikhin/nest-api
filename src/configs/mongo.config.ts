import { ConfigService } from '@nestjs/config';
import { TypegooseModuleOptions } from 'nestjs-typegoose';

export const getMongoConfig = async (
    configService: ConfigService,
): Promise<TypegooseModuleOptions> => {
    return {
        uri: getMongoString(configService),
        ...getMongoOptions(),
    };
};

const getMongoString = (configService: ConfigService) => {
    return configService.get('USE_LOCAL_MONGO_HOST')
        ? 'mongodb://' +
              configService.get('MONGO_LOCAL_HOST') +
              ':' +
              configService.get('MONGO_PORT') +
              '/' +
              configService.get('MONGO_AUTHDATABASE')
        : 'mongodb://' +
              configService.get('MONGO_LOGIN') +
              ':' +
              configService.get('MONGO_PASSWORD') +
              '@' +
              configService.get('MONGO_DOCKER_HOST') +
              ':' +
              configService.get('MONGO_PORT') +
              '/' +
              configService.get('MONGO_AUTHDATABASE');
};

export const getMongoOptions = () => ({
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
