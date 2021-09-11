import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { disconnect } from 'mongoose';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { UserModel } from '../src/user/user.model';
import { JwtService } from '@nestjs/jwt';

const firstLoginDto: CreateUserDto = {
    email: 'auth-test@mail.com',
    password: 'test',
};

const secondLoginDto: CreateUserDto = {
    email: 'auth-test2@mail.com',
    password: 'test',
};

const thirdLoginDto: CreateUserDto = {
    email: 'auth-test3@mail.com',
    password: 'test',
};

const fourthLoginDto: CreateUserDto = {
    email: 'auth-test4@mail.com',
    password: 'test',
};

describe('User controller (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;
    let user: UserModel;
    let accessToken: string;
    let firstRefreshToken: string;
    let secondRefreshToken: string;
    let thirdRefreshToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());

        jwtService = moduleFixture.get<JwtService>(JwtService);

        await app.init();

        const { body } = await request(app.getHttpServer())
            .post('/user/register')
            .send(firstLoginDto);
        user = body;

        await request(app.getHttpServer())
            .post('/user/register')
            .send(secondLoginDto);

        await request(app.getHttpServer())
            .post('/user/register')
            .send(thirdLoginDto);

        await request(app.getHttpServer())
            .post('/user/register')
            .send(fourthLoginDto);

        const { body: loginResponse } = await request(app.getHttpServer())
            .post('/user/login')
            .send(firstLoginDto);
        expect(loginResponse.refreshToken).toBeDefined();
        expect(loginResponse.accessToken).toBeDefined();

        firstRefreshToken = loginResponse.refreshToken;

        const { body: loginResponse2 } = await request(app.getHttpServer())
            .post('/user/login')
            .send(secondLoginDto);
        expect(loginResponse2.refreshToken).toBeDefined();
        expect(loginResponse2.accessToken).toBeDefined();

        secondRefreshToken = loginResponse2.refreshToken;

        const { body: loginResponse4 } = await request(app.getHttpServer())
            .post('/user/login')
            .send(fourthLoginDto);
        expect(loginResponse4.refreshToken).toBeDefined();
        expect(loginResponse4.accessToken).toBeDefined();

        accessToken = loginResponse4.accessToken;
        thirdRefreshToken = loginResponse4.refreshToken;
    });

    it('/user/register (POST) - success', async (done) => {
        const email = 'register@mail.com';
        await request(app.getHttpServer())
            .post('/user/register')
            .send({ email, password: 'test' })
            .expect(201)
            .then(() => {
                done();
            });
    });

    it('/user/register (POST) - failed: email already exists', async (done) => {
        const email = 'register2@mail.com';

        await request(app.getHttpServer())
            .post('/user/register')
            .send({ email, password: 'test' })
            .expect(201)
            .then(() => {
                done();
            });

        await request(app.getHttpServer())
            .post('/user/register')
            .send({ email, password: 'test' })
            .expect(400)
            .then(() => {
                done();
            });
    });

    it('/user/register (POST) - failed: email is missing', async (done) => {
        await request(app.getHttpServer())
            .post('/user/register')
            .send({ password: 'test' })
            .expect(400)
            .then(() => {
                done();
            });
    });

    it('/user/register (POST) - failed: password is missing', async (done) => {
        await request(app.getHttpServer())
            .post('/user/register')
            .send({ email: 'test@mail.ru' })
            .expect(400)
            .then(() => {
                done();
            });
    });

    it('/user/login (POST) - success', async (done) => {
        const { body } = await request(app.getHttpServer())
            .post('/user/login')
            .send(firstLoginDto);

        expect(body.accessToken).toBeDefined();
        expect(body.refreshToken).toBeDefined();

        done();
    });

    it('/user/login (POST) - failed by password', async (done) => {
        await request(app.getHttpServer())
            .post('/user/login')
            .send({
                email: firstLoginDto.email,
                password: 'wrongPass',
            })
            .expect({
                statusCode: 403,
                message: 'Неверный пароль',
                error: 'Forbidden',
            })
            .then(() => done());
    });

    it('/user/login (POST) - failed by email', async (done) => {
        await request(app.getHttpServer())
            .post('/user/login')
            .send({
                email: 'wrong',
                password: firstLoginDto.password,
            })
            .expect({
                statusCode: 403,
                message: 'Пользователея с таким email не существует',
                error: 'Forbidden',
            })
            .then(() => done());
    });

    it('/user/login (POST) - 401 on expired token', async (done) => {
        const token = jwtService.sign(
            { id: 1 },
            { secret: 'test', expiresIn: 1 * 1000 },
        );

        await request(app.getHttpServer())
            .post('/user/logout')
            .set('Authorization', 'Bearer ' + token)
            .send()
            .expect({ statusCode: 401, message: 'Unauthorized' })
            .then(() => done());
    });

    it('/user/logout (POST) - success', async (done) => {
        const token = await jwtService.signAsync({ id: user._id });

        await request(app.getHttpServer())
            .post('/user/logout')
            .set('Authorization', 'Bearer ' + token)
            .send()
            .expect((res) => res.body === 'logged out')
            .then(() => done());
    });

    it('/user/logout (POST) - refresh tokens become invalid on logout', async (done) => {
        await request(app.getHttpServer())
            .post('/user/logout')
            .set('Authorization', 'Bearer ' + accessToken)
            .send()
            .expect(200);

        await request(app.getHttpServer())
            .post('/user/refresh')
            .send({ refreshToken: thirdRefreshToken })
            .expect(404)
            .then((res) => {
                expect(res.body).toStrictEqual({
                    statusCode: 404,
                    message: 'Token not found',
                    error: 'Not Found',
                });
            });

        done();
    });

    it('/user/refresh (POST) - success', async (done) => {
        const { body } = await request(app.getHttpServer())
            .post('/user/refresh')
            .send({ refreshToken: firstRefreshToken });

        expect(body.accessToken).toBeDefined();
        expect(body.refreshToken).toBeDefined();

        done();
    });

    it('/user/refresh (POST) - 404 invalid refreshToken', async (done) => {
        await request(app.getHttpServer())
            .post('/user/refresh')
            .send({ refreshToken: 'INVALID' })
            .expect(404)
            .then((res) => {
                expect(res.body).toStrictEqual({
                    statusCode: 404,
                    message: 'Token not found',
                    error: 'Not Found',
                });
            });

        done();
    });

    it('/user/refresh (POST) - refresh token can be used only once', async (done) => {
        const { body } = await request(app.getHttpServer())
            .post('/user/refresh')
            .send({ refreshToken: secondRefreshToken });

        expect(body.accessToken).toBeDefined();
        expect(body.refreshToken).toBeDefined();

        await request(app.getHttpServer())
            .post('/user/refresh')
            .send({ refreshToken: secondRefreshToken })
            .expect(404)
            .then((res) => {
                expect(res.body).toStrictEqual({
                    statusCode: 404,
                    message: 'Token not found',
                    error: 'Not Found',
                });
            });
        done();
    });

    it('/user/refresh (POST) - multiple refresh tokens are valid', async () => {
        const { body: firstLoginResponse } = await request(app.getHttpServer())
            .post('/user/login')
            .send(secondLoginDto);

        expect(typeof firstLoginResponse.accessToken).toBe('string');
        expect(typeof firstLoginResponse.refreshToken).toBe('string');

        const { body: secondLoginResponse } = await request(app.getHttpServer())
            .post('/user/login')
            .send(secondLoginDto);

        expect(typeof secondLoginResponse.accessToken).toBe('string');
        expect(typeof secondLoginResponse.refreshToken).toBe('string');

        const { body: firstRefreshResponse } = await request(
            app.getHttpServer(),
        )
            .post('/user/refresh')
            .send({ refreshToken: firstLoginResponse.refreshToken });

        expect(firstRefreshResponse.accessToken).toBeDefined();
        expect(firstRefreshResponse.refreshToken).toBeDefined();

        const { body: secondRefreshResponse } = await request(
            app.getHttpServer(),
        )
            .post('/user/refresh')
            .send({ refreshToken: secondLoginResponse.refreshToken });

        expect(secondRefreshResponse.accessToken).toBeDefined();
        expect(secondRefreshResponse.refreshToken).toBeDefined();
    });

    afterAll(async (done) => {
        app.close();

        disconnect();

        done();
    });
});
