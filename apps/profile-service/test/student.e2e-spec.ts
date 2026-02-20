import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Student API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /students -> creates a student', async () => {
    const res = await request(app.getHttpServer())
      .post('/students')
      .send({ name: 'Peter', email: 'peter@example.com' })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Peter');
    expect(res.body.email).toBe('peter@example.com');
  });

  it('POST /students -> rejects invalid email', async () => {
    await request(app.getHttpServer())
      .post('/students')
      .send({ name: 'Peter', email: 'not-an-email' })
      .expect(400);
  });

  it('GET /students -> lists students', async () => {
    const res = await request(app.getHttpServer())
      .get('/students')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });
});