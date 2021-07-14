import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TOP_PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { TopPageModel } from './top-page.model';

@Injectable()
export class TopPageService {
    constructor(
        @InjectModel(TopPageModel)
        private readonly topPageModel: ModelType<TopPageModel>,
    ) {}

    async create(dto: CreateTopPageDto) {
        return this.topPageModel.create(dto);
    }

    async findAll() {
        return this.topPageModel.find({});
    }

    async findById(id: string) {
        const topPage = await this.topPageModel.findById(id).exec();

        if (!topPage) {
            throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
        }

        return topPage;
    }

    async findByAlias(alias: string) {
        const topPage = await this.topPageModel.findOne({ alias }).exec();

        if (!topPage) {
            throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
        }

        return topPage;
    }

    async deleteById(id: string) {
        const deletedPage = await this.topPageModel
            .findByIdAndDelete(id)
            .exec();

        if (!deletedPage) {
            throw new NotFoundException(TOP_PAGE_NOT_FOUND_ERROR);
        }

        return deletedPage;
    }

    async updateById(id: string, dto: CreateTopPageDto) {
        return this.topPageModel
            .findByIdAndUpdate(id, dto, { new: true })
            .exec();
    }

    async findByCategory(dto: FindTopPageDto) {
        return this.topPageModel
            .aggregate()
            .match({ firstCategory: dto.firstCategory })
            .group({
                _id: { secondCategory: '$secondCategory' },
                pages: { $push: { alias: '$alias', title: '$title' } },
            })
            .exec();
    }

    async findByText(text: string) {
        return this.topPageModel
            .find({
                $text: { $search: text, $caseSensitive: false },
            })
            .exec();
    }
}
