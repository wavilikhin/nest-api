import {
    Controller,
    HttpCode,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FileElementRespose } from './dto/file-element.response';
import { FilesService } from './files.service';
import { Mfile } from './mfile.class';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}
    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @UseInterceptors(FileInterceptor('files'))
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
    ): Promise<FileElementRespose[]> {
        const saveArray: Mfile[] = [new Mfile(file)];

        if (file.mimetype.includes('image')) {
            const buffer = await this.filesService.convertToWebP(file.buffer);

            saveArray.push(
                new Mfile({
                    originalname: `${file.originalname.split('.')[0]}.wepb`,
                    buffer,
                }),
            );
        }
        return this.filesService.saveFiles(saveArray);
    }
}
