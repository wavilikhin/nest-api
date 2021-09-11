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
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FromDbReviewDto } from './dto/from-db-review.dto';

@ApiTags('review')
@Controller('review')
export class ReviewController {
    constructor(
        private readonly previewService: ReviewService,
        private readonly telegramService: TelegramService,
    ) {}

    @ApiOperation({ summary: 'Create new review' })
    @ApiConsumes('application/json')
    @ApiBody({
        description: 'Review DTO',
        type: CreateReviewDto,
    })
    @ApiCreatedResponse({
        description: 'Created review object',
        type: FromDbReviewDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid DTO format',
    })
    @ApiInternalServerErrorResponse({
        description: 'Unknown server error',
    })
    @UsePipes(new ValidationPipe())
    @Post('')
    async create(@Body() dto: CreateReviewDto) {
        return this.previewService.create(dto);
    }

    @ApiOperation({ summary: 'Notify with new review' })
    @ApiConsumes('application/json')
    @ApiBody({
        description: 'Review DTO',
        type: CreateReviewDto,
    })
    @ApiCreatedResponse({
        description: 'Notification successfully send',
    })
    @ApiBadRequestResponse({
        description: 'Invalid DTO format',
    })
    @ApiInternalServerErrorResponse({
        description: 'Unknown server error',
    })
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

    @ApiOperation({ summary: 'Delete review by id' })
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Deleted review',
        type: FromDbReviewDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid id format' })
    @ApiUnauthorizedResponse({ description: 'Invalid access token' })
    @ApiNotFoundResponse({ description: 'Review not found' })
    @ApiInternalServerErrorResponse({ description: 'Unknown server error' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deletedDoc = await this.previewService.delete(id);

        if (!deletedDoc) {
            throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
    }

    @ApiOperation({ summary: 'Get review by id' })
    @ApiOkResponse({
        description: 'Found review',
        type: FromDbReviewDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid id format' })
    @ApiNotFoundResponse({ description: 'Review not found' })
    @ApiInternalServerErrorResponse({ description: 'Unknown server error' })
    @Get('byProduct/:productId')
    async getByProduct(@Param('productId', IdValidationPipe) id: string) {
        return this.previewService.findByProductId(id);
    }
}
