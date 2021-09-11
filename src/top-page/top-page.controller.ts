import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Inject,
    Param,
    Patch,
    Post,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
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
    ApiParam,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TopPageModel } from './top-page.model';
import { FromDbTopPageDto } from './dto/from-db-top-page.dto';

@ApiTags('top-page')
@Controller('top-page')
export class TopPageController {
    constructor(
        @Inject(TopPageService) private readonly topPageService: TopPageService,
    ) {}

    @ApiOperation({ summary: 'Create new top page' })
    @ApiBearerAuth()
    @ApiConsumes('application/json')
    @ApiBody({
        description: 'Top page DTO',
        type: CreateTopPageDto,
    })
    @ApiCreatedResponse({
        description: 'Created top page object',
        type: FromDbTopPageDto,
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid access token',
    })
    @ApiBadRequestResponse({
        description: 'Invalid DTO format',
    })
    @ApiInternalServerErrorResponse({
        description: 'Alias already exists or Unknown server error',
    })
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('')
    async create(@Body() dto: CreateTopPageDto) {
        return this.topPageService.create(dto);
    }

    @ApiOperation({ summary: 'Find top page by id' })
    @ApiOkResponse({
        description: 'Top page by id',
        type: FromDbTopPageDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid id format' })
    @ApiNotFoundResponse({ description: 'Page not found' })
    @ApiInternalServerErrorResponse({ description: 'Unknown server error' })
    @Get('/byId/:id')
    async getById(@Param('id', IdValidationPipe) id: string) {
        return this.topPageService.findById(id);
    }

    @ApiOperation({ summary: `Find top page by it's alias` })
    @ApiOkResponse({
        description: 'Top page by alias',
        type: FromDbTopPageDto,
    })
    @ApiNotFoundResponse({ description: 'Page not found' })
    @ApiInternalServerErrorResponse({ description: 'Unknown server error' })
    @Get('/byAlias/:alias')
    async getByAlias(@Param('alias') alias: string) {
        return this.topPageService.findByAlias(alias);
    }

    @ApiOperation({ summary: 'Delete top page by id' })
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Deleted top page',
        type: FromDbTopPageDto,
    })
    @ApiNotFoundResponse({ description: 'Page not found' })
    @ApiUnauthorizedResponse({ description: 'Invalid access token' })
    @ApiInternalServerErrorResponse({ description: 'Unknown server error' })
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        return this.topPageService.deleteById(id);
    }

    @ApiOperation({ summary: 'Update top page by id' })
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Updated top page',
        type: FromDbTopPageDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid id format' })
    @ApiNotFoundResponse({ description: 'Page not found' })
    @ApiUnauthorizedResponse({ description: 'Invalid access token' })
    @ApiInternalServerErrorResponse({ description: 'Unknown server error' })
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Patch(':id')
    async patch(
        @Param('id', IdValidationPipe) id: string,
        @Body() dto: CreateTopPageDto,
    ) {
        return this.topPageService.updateById(id, dto);
    }

    @ApiOperation({ summary: 'Find top page found by category' })
    @ApiOkResponse({
        description: 'Updated top page',
        type: FromDbTopPageDto,
    })
    @ApiBadRequestResponse({
        description: 'Invalid enum value, provide number from 0 to 3',
    })
    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('find')
    async find(@Body() dto: FindTopPageDto) {
        return this.topPageService.findByCategory(dto);
    }

    @ApiOperation({ summary: 'Endpoint for searching by text' })
    @ApiOkResponse({
        description: 'Top page found by search text',
        type: FromDbTopPageDto,
    })
    @Get('textSearch/:text')
    async textSearch(@Param('text') text: string) {
        return this.topPageService.findByText(text);
    }
}
