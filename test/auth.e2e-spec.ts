import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { disconnect } from 'mongoose';
// import { AuthDto } from 'src/auth/dto/auth.dto';
import { UserModel } from 'src/user/user.model';

const loginDto: AuthDto = {
    email: 'auth-test@mail.com',
    password: 'test',
};

// TODO: Rewrite using UserController

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let user: UserModel;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        await app.init();

        const { body } = await request(app.getHttpServer())
            .post('/auth/register')
            .send(loginDto);

        user = body;
    });

    it('/auth/login (POST) - success', async (done) => {
        const { body } = await request(app.getHttpServer())
            .post('/auth/login')
            .send(loginDto);

        expect(body.accessToken).toBeDefined();
        done();
    });

    it('/auth/login (POST) - failed by password', async (done) => {
        await request(app.getHttpServer())
            .post('/auth/login')
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

    it('/auth/login (POST) - failed by email', async (done) => {
        await request(app.getHttpServer())
            .post('/auth/login')
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
        await request(app.getHttpServer()).delete(`/auth/delete/${user._id}`);

        disconnect();

        done();
    });
});
