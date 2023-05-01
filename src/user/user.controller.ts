import * as _ from 'lodash';
import { Request, Response, NextFunction } from 'express';
// import createError from 'http-errors';
import { ModifiedResponse } from '../types/express';
import { PrismaClient, role } from '@prisma/client';

export class UserController {
  static fetchAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | ModifiedResponse> => {
    try {
      let page = req.query.page as string | number;
      let limit = req.query.limit as string | number;

      if (_.isNil(page)) {
        page = 1;
      }

      if (_.isNil(limit)) {
        limit = 10;
      }

      page = parseInt(page as string);
      limit = parseInt(limit as string);

      const prisma = new PrismaClient();

      const userDocs = await prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {},
      });

      return res.status(200).json({
        users: _.map(userDocs, (user) => {
          return _.omit(user, 'password');
        }),
        current_page: page,
      });
    } catch (err) {
      return next(err);
    }
  };

  static modifyUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | ModifiedResponse> => {
    try {
      const userId = _.get(req.params, 'id');

      const email: string = _.get(req.body, 'email');
      const role: role = _.get(req.body, 'role');

      const prisma = new PrismaClient();

      const userDoc = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          email: email,
          role,
        },
      });

      return res.status(200).json({
        message: 'Successfully updated',
        user: userDoc,
      });
    } catch (err) {
      return next(err);
    }
  };
}
