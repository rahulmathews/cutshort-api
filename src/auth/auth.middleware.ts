import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '@prisma/client';

import { TokenUtil } from '../utils';

export class AuthMiddleware {
  static authLocal = (
    req: Request & {
      access_token?: string;
      // refresh_token?: string;
    },
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      passport.authenticate(
        'local',
        { session: false },
        function (err: Error, user: User) {
          if (err || !user) {
            return next(err);
          }

          const ACCESS_TOKEN_EXPIRATION_MS =
            parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN as string) * 1000;

          const payload = {
            username: user.name,
            userId: user.id,
            role: user.role,
            expiresAt: Date.now() + ACCESS_TOKEN_EXPIRATION_MS,
          };

          //Assign payload to req.user
          req.login(payload, { session: false }, function (err) {
            if (err) {
              return next(err);
            }
          });

          const access_token = jwt.sign(
            JSON.stringify(payload),
            process.env.ACCESS_TOKEN_SECRET as string,
          );
          // const refresh_token = jwt.sign(
          //   JSON.stringify(payload),
          //   process.env.REFRESH_TOKEN_SECRET as string,
          //   { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN },
          // );

          // allocate tokens to req variable

          req.access_token = access_token;
          // req.refresh_token = refresh_token;

          return next();
        },
      )(req, res, next);
      // return next();
    } catch (err) {
      return next(err);
    }
  };

  static authJwt = (req: Request, res: Response, next: NextFunction): void => {
    try {
      TokenUtil.extractTokenFromHeader(req, next);

      passport.authenticate(
        'jwt',
        { session: false },
        function (err: Error, user: User) {
          if (err || !user) {
            return next(err);
          }

          //Assign payload to req.user
          req.login(user, { session: false }, function (err) {
            if (err) {
              return next(err);
            }
          });

          return next();
        },
      )(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
}
