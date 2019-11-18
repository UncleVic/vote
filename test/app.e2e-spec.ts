import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '../src/validation.pipe';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('Not authorized requests', () => {
    it('GET /', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Vote Service is running');
    });

    it('POST /get-token Fail', () => {
      return request(app.getHttpServer())
        .post('/get-token')
        .send({})
        .expect('Content-Type', /json/)
        .expect(400);
    });

    it('POST /get-token OK', () => {
      return request(app.getHttpServer())
        .post('/get-token')
        .send({ accessKey: 'Test' })
        .expect('Content-Type', /json/)
        .expect(201);
    });

    it('GET /results wrong accessToken', () => {
      return request(app.getHttpServer())
        .get('/results')
        .set('x-access-token', 'accessToken')
        .expect('Content-Type', /json/)
        .expect(401);
    });

    it('GET /results no "x-access-token"', () => {
      return request(app.getHttpServer())
        .get('/results')
        .expect('Content-Type', /json/)
        .expect(401);
    });

  });

  describe('Authorized requests', () => {
    let accessToken: string = '';

    beforeAll(async () => {
      await request(app.getHttpServer())
        .post('/get-token')
        .send({ accessKey: 'Test' })
        .expect('Content-Type', /json/)
        .expect(201)
        .expect((res) => {
          accessToken = res.body.accessToken;
        });
    });

    describe('Add vote', () => {
      const voteFor: string = Math.random().toString(36).substr(2, 9);

      it('POST Insert vote', async () => {
        return await request(app.getHttpServer())
          .post('/vote')
          .set('x-access-token', accessToken)
          .send({ voteFor })
          .expect('Content-Type', /json/)
          .expect(201, { success: true });
      });

      it('POST Update vote', async () => {
        return await request(app.getHttpServer())
          .post('/vote')
          .set('x-access-token', accessToken)
          .send({ voteFor })
          .expect('Content-Type', /json/)
          .expect(201, { success: true });
      });
    });

    describe('Get Results', () => {
      it('GET /results', async () => {
        return await request(app.getHttpServer())
          .get('/results')
          .set('x-access-token', accessToken)
          .expect('Content-Type', /json/)
          .expect(200);
      });
    });
  });
});
