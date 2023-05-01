import { Request, NextFunction } from 'express';
import * as _ from 'lodash';
import createError from 'http-errors';

// import { AuthMiddleware } from '../middlewares';

export class TokenUtil {
  //Function to extract bearer token from authorisation header
  static extractTokenFromHeader = (
    req: Request,
    next: NextFunction,
  ): string | void => {
    try {
      if (_.has(req.headers, 'authorization')) {
        const splitArr = (req.headers['authorization'] as string).split(
          'Bearer',
        );
        return splitArr[1].trim();
      } else {
        const error = createError(400, 'Cannot find Authorization header');
        throw error;
      }
    } catch (err) {
      return next(err);
    }
  };
}
