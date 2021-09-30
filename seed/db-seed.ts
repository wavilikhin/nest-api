import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { getMongoOptions } from '../src/configs/mongo.config';
import { TopPageModel } from '../src/top-page/top-page.model';
import { topPageFixtures } from './data/top-page';
import { ProductModel } from '../src/product/product.model';
import { productsFixtures } from './data/products';

dotenv.config();

(async () => {
    try {
        Logger.log('Connecting to db');

        await mongoose.connect(
            'mongodb://' +
                process.env['MONGO_LOGIN'] +
                ':' +
                process.env['MONGO_PASSWORD'] +
                '@' +
                process.env['MONGO_DOCKER_HOST'] +
                ':' +
                process.env['MONGO_PORT'] +
                '/' +
                process.env['MONGO_AUTHDATABASE'],
            getMongoOptions(),
        );
        Logger.log('Db successfully connected');
    } catch (error) {
        Logger.error(`Db seed error:\n${error}`);
        process.exit(1);
    }

    const topPageModel = getModelForClass(TopPageModel, {
        schemaOptions: {
            collection: 'TopPage',
        },
    });

    for (const topPage of topPageFixtures) {
        await topPageModel.create(topPage).catch((error) => {
            Logger.error(`topPageModel.create() error:\n${error}`);
            process.exit(1);
        });
    }

    const productModel = getModelForClass(ProductModel, {
        schemaOptions: {
            collection: 'Product',
        },
    });

    for (const product of productsFixtures) {
        await productModel.create(product).catch((error) => {
            Logger.error(`productModel.create() error:\n${error}`);
            process.exit(1);
        });
    }

    Logger.log('Db successfully seeded');

    process.exit(0);
})();
