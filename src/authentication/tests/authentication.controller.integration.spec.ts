import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import User from '../../users/user.entity';
import { UsersService } from '../../users/users.service';
import { AuthenticationService } from '../authentication.service';
import { AuthenticationController } from '../authentication.controller';
import mockedJwtService from '../../utils/mocks/jwt.service';
import mockedConfigService from '../../utils/mocks/config.service';
import mockedUser from './user.mock';

describe('The AuthenticationController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const usersRepository = {
      create: jest.fn().mockResolvedValue(mockedUser),
      save: jest.fn().mockResolvedValue(Promise.resolve()),
    };

    const module = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        UsersService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });
  describe('when registering with valid data', () => {
    it('should respond with the data of the user without the password', () => {
      const expectedData = { ...mockedUser };
      delete expectedData.password;
      return request(app.getHttpServer())
        .post('/authentication/register')
        .send({
          email: mockedUser.email,
          name: mockedUser.name,
          password: 'strongPassword',
        })
        .expect(201)
        .expect(expectedData);
    });
  });

  describe('when registering with invalid data', () => {
    it('should throw an error', () => {
      return request(app.getHttpServer())
        .post('/authentication/register')
        .send({
          name: mockedUser.name,
        })
        .expect(400);
    });
  });
});
