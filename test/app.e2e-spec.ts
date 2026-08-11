import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Server } from 'http';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-jwt-secret';
    process.env.NODE_ENV = 'test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    server = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET) should require authentication', () => {
    return request(server).get('/').expect(401);
  });
});
