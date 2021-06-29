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
import { IdValidationPipe } from 'src/pipes/id-validation.pipe';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
    constructor(
        @Inject(TopPageService) private readonly topPageService: TopPageService,
    ) {}
    // TODO: @Post('')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    @Post('create')
    async create(@Body() dto: CreateTopPageDto) {
        return this.topPageService.create(dto);
    }

    @Get('/byId/:id')
    async getById(@Param('id', IdValidationPipe) id: string) {
        return this.topPageService.findById(id);
    }

    @Get('/byAlias/:alias')
    async getByAlias(@Param('alias') alias: string) {
        return this.topPageService.findByAlias(alias);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        return this.topPageService.deleteById(id);
    }

    @UsePipes(new ValidationPipe())
    @Patch(':id')
    async patch(
        @Param('id', IdValidationPipe) id: string,
        @Body() dto: CreateTopPageDto,
    ) {
        return this.topPageService.updateById(id, dto);
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('find')
    async find(@Body() dto: FindTopPageDto) {
        return this.topPageService.findByCategory(dto);
    }

    @Get('textSearch/:text')
    async textSearch(@Param('text') text: string) {
        return this.topPageService.findByText(text);
    }
}
