import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { ModifiedResponse } from '../types/express';
import { PrismaClient } from '@prisma/client';

export class AuthController {
  static registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | ModifiedResponse> => {
    try {
      const { name, password, email } = _.get(req, 'body');
      const saltRounds = parseInt(process.env.SALT_ROUNDS as string);
      const hashedPwd = await bcrypt.hash(password, saltRounds);

      const prisma = new PrismaClient();

      const insertObj = {
        name,
        password: hashedPwd,
        email,
      };

      const userDoc = await prisma.user.create({
        data: insertObj,
      });
      if (userDoc) {
        return res.status(200).json({ message: 'Registered Successfully' });
      } else {
        return res.status(204).json({ message: 'Registration Failed' });
      }
    } catch (err) {
      return next(err);
    }
  };

  static loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | ModifiedResponse> => {
    try {
      if (!_.get(req, 'access_token')) {
        const error = createError(500, 'Token Creation Failed');
        return next(error);
      }

      return res.status(200).json({
        message: 'Successfully loggedin',
        access_token: req['access_token'],
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        // refresh_token: req['refresh_token'],
      });
    } catch (err) {
      return next(err);
    }
  };
}
