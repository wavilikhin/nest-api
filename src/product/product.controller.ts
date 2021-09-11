import {
    Controller,
    Post,
    Get,
    Delete,
    Patch,
    Body,
    Param,
    HttpCode,
    NotFoundException,
    UsePipes,
    ValidationPipe,
    UseGuards,
} from '@nestjs/common';
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
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { FromDbProductDto } from './dto/from-db-product.dto';
import { PRODUCT_NOT_FOUND_ERROR } from './product.constants';
import { ProductService } from './product.service';

@ApiTags('product')
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @ApiOperation({ summary: 'Create new product' })
    @ApiBearerAuth()
    @ApiConsumes('application/json')
    @ApiBody({
        description: 'Product DTO',
        type: CreateProductDto,
    })
    @ApiCreatedResponse({
        description: 'Created top page object',
        type: FromDbProductDto,
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
    @Post('')
    async create(@Body() dto: CreateProductDto) {
        return this.productService.create(dto);
    }

    @ApiOperation({ summary: 'Find product by id' })
    @ApiOkResponse({
        description: 'Product page by id',
        type: FromDbProductDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid id format' })
    @ApiNotFoundResponse({ description: 'Product not found' })
    @ApiInternalServerErrorResponse({ description: 'Unknown server error' })
    @Get(':id')
    async get(@Param('id', IdValidationPipe) id: string) {
        const product = await this.productService.findById(id);

        if (!product) {
            throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
        }

        return product;
    }

    @ApiOperation({ summary: 'Delete product by id' })
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Deleted product',
        type: FromDbProductDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid id format' })
    @ApiUnauthorizedResponse({ description: 'Invalid access token' })
    @ApiNotFoundResponse({ description: 'Product not found' })
    @ApiInternalServerErrorResponse({ description: 'Unknown server error' })
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async delete(@Param('id', IdValidationPipe) id: string) {
        const deletedProduct = await this.productService.deleteById(id);

        if (!deletedProduct) {
            throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
        }

        return deletedProduct;
    }

    @ApiOperation({ summary: 'Update product by id' })
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Updated product',
        type: FromDbProductDto,
    })
    @ApiBadRequestResponse({ description: 'Invalid id format' })
    @ApiUnauthorizedResponse({ description: 'Invalid access token' })
    @ApiNotFoundResponse({ description: 'Product not found' })
    @ApiInternalServerErrorResponse({ description: 'Unknown server error' })
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async patch(
        @Param('id', IdValidationPipe) id: string,
        @Body() dto: CreateProductDto,
    ) {
        const updatedProduct = await this.productService.updateById(id, dto);

        if (!updatedProduct) {
            throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
        }

        return updatedProduct;
    }

    @ApiOperation({ summary: 'Find products by category' })
    @ApiOkResponse({
        description: 'Products found by category',
        type: [FromDbProductDto],
    })
    @ApiInternalServerErrorResponse({ description: 'Unknown server error' })
    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Post('find')
    async find(@Body() dto: FindProductDto) {
        return this.productService.findWithReviews(dto);
    }
}
