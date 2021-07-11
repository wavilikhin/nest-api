import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { disconnect } from 'mongoose';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { UserModel } from 'src/user/user.model';

const loginDto: CreateUserDto = {
    email: 'auth-test@mail.com',
    password: 'test',
};

describe('User controller (e2e)', () => {
    let app: INestApplication;
    let user: UserModel;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        await app.init();

        const { body } = await request(app.getHttpServer())
            .post('/user/register')
            .send(loginDto);

        user = body;
    });

    it('/user/login (POST) - success', async (done) => {
        const { body } = await request(app.getHttpServer())
            .post('/user/login')
            .send(loginDto);

        expect(body.accessToken).toBeDefined();
        done();
    });

    it('/user/login (POST) - failed by password', async (done) => {
        await request(app.getHttpServer())
            .post('/user/login')
            .send({
                email: loginDto.email,
                password: 'wrongPass',
            })
            .expect({
                statusCode: 401,
                message: 'Неверный пароль',
                error: 'Unauthorized',
            })
            .then(() => done());
    });

    it('/user/login (POST) - failed by email', async (done) => {
        await request(app.getHttpServer())
            .post('/user/login')
            .send({
                email: 'wrong',
                password: loginDto.password,
            })
            .expect({
                statusCode: 401,
                message: 'Пользователея с таким email не существует',
                error: 'Unauthorized',
            })
            .then(() => done());
    });

    afterAll(async (done) => {
        await request(app.getHttpServer()).delete(`/user/delete/${user._id}`);

        disconnect();

        done();
    });
});
