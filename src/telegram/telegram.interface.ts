import { ModuleMetadata } from '@nestjs/common';

export interface ITelegramOptions {
    chatId: string;
    token: string;
}

export interface ITelegramModuleAsyncOptions
    extends Pick<ModuleMetadata, 'imports'> {
    useFactory: (
        // tslint:disable-next-line: no-any
        ...args: any[]
    ) => Promise<ITelegramOptions> | ITelegramOptions;

    // tslint:disable-next-line: no-any
    inject?: any[];
}
