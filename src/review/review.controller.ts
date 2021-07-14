import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewService } from './review.service';
import { TelegramService } from '../telegram/telegram.service';

@Controller('review')
export class ReviewController {
    constructor(
        private readonly previewService: ReviewService,
        private readonly telegramService: TelegramService,
    ) {}

    @UsePipes(new ValidationPipe())
    @Post('')
    async create(@Body() dto: CreateReviewDto) {
        return this.previewService.create(dto);
    }

    @UsePipes(new ValidationPipe())
    @Post('notify')
    async notify(@Body() dto: CreateReviewDto) {
        const message =
            `Id: ${dto.productId}\n` +
            `Имя: ${dto.name}\n` +
            `Заголовок: ${dto.title}\n` +
            `Описание: ${dto.description}\n` +
            `Рейтинг: ${dto.rating}\n`;

        return this.telegramService.sendMessage(message);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deletedDoc = await this.previewService.delete(id);

        if (!deletedDoc) {
            throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
    }

    @Get('byProduct/:productId')
    async getByProduct(@Param('productId', IdValidationPipe) id: string) {
        return this.previewService.findByProductId(id);
    }
}
