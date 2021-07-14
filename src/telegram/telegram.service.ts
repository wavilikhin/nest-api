import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constants';
import { ITelegramOptions } from './telegram.interface';

@Injectable()
export class TelegramService {
    bot: Telegraf;
    options: ITelegramOptions;

    constructor(
        @Inject(TELEGRAM_MODULE_OPTIONS)
        private readonly telegramOptions: ITelegramOptions,
    ) {
        this.bot = new Telegraf(telegramOptions.token);
        this.options = telegramOptions;
    }

    async sendMessage(message: string, chatId = this.options.chatId) {
        await this.bot.telegram.sendMessage(chatId, message);
    }
}
