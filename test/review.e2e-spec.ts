import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
    name: 'Тест',
    title: 'Заголовок',
    description: 'Описание тестовое',
    rating: 5,
    productId,
};

const loginDto: AuthDto = {
    email: 'test@mail.com',
    password: 'test',
};

describe('ReviewController (e2e)', () => {
    let app: INestApplication;
    let createdId: string;
    let token: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        const { body } = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto);

        token = body.accessToken;
    });

    it('/review/create (POST) - success', async (done) => {
        return request(app.getHttpServer())
            .post('/review/create')
            .send(testDto)
            .expect(201)
            .then(({ body }: request.Response) => {
                createdId = body._id;
                expect(createdId).toBeDefined();
                done();
            });
    });

    it('/review/create (POST) - fail', async (done) => {
        return request(app.getHttpServer())
            .post('/review/create')
            .send({ ...testDto, rating: 0 })
            .expect(400)
            .then(({ body }: request.Response) => {
                expect(body.statusCode).toBe(400);
                expect(body.message[0]).toBe('Рейтинг не может быть < 1');
                done();
            });
    });

    it('/review/byProduct/:productId (GET) - success', async (done) => {
        return request(app.getHttpServer())
            .get('/review/byProduct/' + productId)
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.length).toBe(1);
                done();
            });
    });

    it('/review/byProduct/:productId (GET) - fail', async (done) => {
        return request(app.getHttpServer())
            .get('/review/byProduct/' + new Types.ObjectId().toHexString())
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.length).toBe(0);
                done();
            });
    });

    it('/review/:id (DELETE) - success', async (done) => {
        return request(app.getHttpServer())
            .delete('/review/' + createdId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .then(() => done());
    });

    it('/review/:id (DELETE) - fail', async (done) => {
        return request(app.getHttpServer())
            .delete('/review/' + new Types.ObjectId().toHexString())
            .set('Authorization', 'Bearer ' + token)
            .expect(404)
            .then(() => done());
    });

    afterAll(() => {
        disconnect();
    });
});
