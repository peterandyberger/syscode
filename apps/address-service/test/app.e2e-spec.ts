import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

function basic(user: string, pass: string) {
  return 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
}

describe('Address (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.BASIC_USER = 'syscode';
    process.env.BASIC_PASS = 'syscode';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  it('GET /address -> 401 without auth', async () => {
    await request(app.getHttpServer()).get('/address').expect(401);
  });

  it('GET /address -> 200 with auth', async () => {
    const res = await request(app.getHttpServer())
      .get('/address')
      .set('Authorization', basic('syscode', 'syscode'))
      .expect(200);

    expect(res.body.id).toBeTruthy();
    expect(typeof res.body.address).toBe('string');
  });
});
