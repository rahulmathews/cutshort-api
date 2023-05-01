import passport, { PassportStatic } from 'passport';
import passportJwt from 'passport-jwt';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import createError from 'http-errors';

import { PrismaClient } from '@prisma/client';
import _ from 'lodash';

const jwtStrategy = passportJwt.Strategy;
const localStrategy = passportLocal.Strategy;
const extractJwt = passportJwt.ExtractJwt;

//Declare all the strategies here
export class PassportUtil {
  static init(): PassportStatic {
    //Local Strategy
    passport.use(
      new localStrategy(
        {
          usernameField: 'email',
          passwordField: 'password',
        },
        async (email, password, done) => {
          try {
            const prisma = new PrismaClient();

            const userDoc = await prisma.user.findUnique({
              where: { email },
            });

            if (_.isNil(userDoc)) {
              return done(createError(401, 'Invalid Username/Password'));
            }

            const ifMatchedPwd = await bcrypt.compare(
              password,
              userDoc.password,
            );
            if (ifMatchedPwd) {
              return done(null, userDoc);
            } else {
              return done(createError(401, 'Invalid Username/Password'));
            }
          } catch (err) {
            done(err);
          }
        },
      ),
    );

    //Jwt Strategy
    passport.use(
      new jwtStrategy(
        {
          jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        },
        async (payload, done) => {
          try {
            const prisma = new PrismaClient();

            const userDoc = await prisma.user.findUnique({
              where: { id: payload.userId },
            });

            if (userDoc) {
              if (Date.now() > payload.expiresAt - 10000) {
                const error = createError(401, 'Token Expired');
                return done(error);
              } else {
                return done(null, userDoc, payload);
              }
            } else {
              return done(createError(401, 'Invalid Username/Password'));
            }
          } catch (err) {
            done(err);
          }
        },
      ),
    );

    return passport;
  }
}
