import { Injectable } from '@nestjs/common';
import { FileElementRespose } from './dto/file-element.response';
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { Mfile } from './mfile.class';
@Injectable()
export class FilesService {
    //  TODO:
    //  [] - Add (sqoosh)[https://github.com/GoogleChromeLabs/squoosh/tree/dev/libsquoosh] for img min
    //  [] - Replace nestjs static with nginx

    async saveFiles(files: Mfile[]): Promise<FileElementRespose[]> {
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

    async convertToWebP(file: Buffer): Promise<Buffer> {
        return sharp(file).webp().toBuffer();
    }
}
