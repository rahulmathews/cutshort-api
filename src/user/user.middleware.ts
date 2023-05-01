import { NextFunction, Request, Response } from 'express';
import _ from 'lodash';
import createError from 'http-errors';
import { role } from '@prisma/client';

export class UserMiddleware {
  static allowOnlyAdmin(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void {
    if (!_.has(req, 'user.role')) {
      const err = createError(401, 'Invalid role');
      return next(err);
    }

    if (_.get(req.user, 'role') === role.ADMIN) {
      return next();
    }

    const err = createError(401, 'Invalid role');
    return next(err);
  }
}
