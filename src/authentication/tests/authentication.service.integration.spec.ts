import * as bcrypt from 'bcrypt';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';

import User from '../../users/user.entity';
import { AuthenticationService } from '../authentication.service';
import { UsersService } from '../../users/users.service';
import mockedJwtService from '../../utils/mocks/jwt.service';
import mockedConfigService from '../../utils/mocks/config.service';
import mockedUser from './user.mock';

jest.mock('bcrypt');

describe('The AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let usersService: UsersService;
  let findUser: jest.Mock;
  let bcryptCompare: jest.Mock;

  beforeEach(async () => {
    findUser = jest.fn();
    bcryptCompare = jest.fn();
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const usersRepository = {
      findOne: findUser,
    };

    const module = await Test.createTestingModule({
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
    authenticationService = await module.get(AuthenticationService);
    usersService = await module.get(UsersService);
  });
  describe('when accessing the data of authenticating user', () => {
    it('should attempt to get a user by email', async () => {
      bcryptCompare.mockReturnValue(true);
      findUser.mockResolvedValue(mockedUser);
      const getByEmailSpy = jest.spyOn(usersService, 'getByEmail');

      await authenticationService.getAuthenticatedUser({
        email: 'user@email.com',
        password: 'strongPassword',
      });
      expect(getByEmailSpy).toBeCalledTimes(1);
    });

    describe('and the provided password is not valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });

      it('should throw an error', async () => {
        await expect(
          authenticationService.getAuthenticatedUser({
            email: 'user@email.com',
            password: 'invalidPassword',
          }),
        ).rejects.toThrow(HttpException);
      });
    });

    describe('and the provided password is valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });

      describe('and the user is found in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(mockedUser);
        });

        it('should return the user data', async () => {
          const user = await authenticationService.getAuthenticatedUser({
            email: 'user@email.com',
            password: 'validPassword',
          });
          expect(user).toBe(mockedUser);
        });
      });
      describe('and the user is not found in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(undefined);
        });

        it('should throw an error', async () => {
          await expect(
            authenticationService.getAuthenticatedUser({
              email: 'unknown@email.com',
              password: 'strongPassword',
            }),
          ).rejects.toThrow(HttpException);
        });
      });
    });
  });
});
