import { Injectable } from '@nestjs/common';
import { FileElementRespose } from './dto/file-element.response';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

@Injectable()
export class FilesService {
    async saveFiles(
        files: Express.Multer.File[],
    ): Promise<FileElementRespose[]> {
        const dateFolder = format(new Date(), 'yyyy-MM-dd');

        const uploadFolder = `${path}/uploads/${dateFolder}`;

        await ensureDir(uploadFolder);

        const res: FileElementRespose[] = [];

        for (const file of files) {
            await writeFile(
                `${uploadFolder}/${file.originalname}`,
                file.buffer,
            );

            res.push({
                url: `${dateFolder}/${file.originalname}`,
                name: file.originalname,
            });
        }

        return res;
    }
}
