import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { disconnect } from 'mongoose';

const user = { email: 'test@mail.ru', password: 'test' };

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        await app.init();
    });

    it('/auth/login (POST) - success', async (done) => {
        const { body } = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: user.email,
                password: user.password,
            });

        expect(body.accessToken).toBeDefined();
        done();
    });

    it('/auth/login (POST) - failed by password', async (done) => {
        await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: user.email,
                password: 'wrongPass',
            })
            .expect({
                statusCode: 401,
                message: 'Неверный пароль',
                error: 'Unauthorized',
            })
            .then(() => done());
    });

    it('/auth/login (POST) - failed by email', async (done) => {
        await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'wrong',
                password: user.password,
            })
            .expect({
                statusCode: 401,
                message: 'Пользователея с таким email не существует',
                error: 'Unauthorized',
            })
            .then(() => done());
    });

    afterAll(() => {
        disconnect();
    });
});
