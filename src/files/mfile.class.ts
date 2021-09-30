export class Mfile {
    originalname: string;
    buffer: Buffer;

    constructor(file: Express.Multer.File | Mfile) {
        this.buffer = file.buffer;
        this.originalname = file.originalname;
    }
}
