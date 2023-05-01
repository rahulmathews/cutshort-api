import * as _ from 'lodash';
import { Request, Response, NextFunction } from 'express';
// import createError from 'http-errors';
import { ModifiedResponse } from '../types/express';
import { PrismaClient, role } from '@prisma/client';

export class PostController {
  static createPost = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | ModifiedResponse> => {
    try {
      const text = _.get(req.body, 'text');

      const prisma = new PrismaClient();

      const post = await prisma.post.create({
        data: {
          text,
          author: { connect: { id: _.get(req.user, 'id') } },
        },
      });

      return res.status(200).json({
        message: 'Successfully created',
        post,
      });
    } catch (err) {
      return next(err);
    }
  };

  static fetchAllPosts = async (
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

      const posts = await prisma.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          ...(_.get(req.user, 'role') === role.ADMIN
            ? {}
            : {
                authorId: {
                  equals: _.get(req.user, 'id'),
                },
              }),
        },
      });

      return res.status(200).json({
        posts,
        current_page: page,
      });
    } catch (err) {
      return next(err);
    }
  };

  static modifyPost = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | ModifiedResponse> => {
    try {
      const postId = _.get(req.params, 'id');

      const text: string = _.get(req.body, 'text');

      const prisma = new PrismaClient();

      await prisma.post.updateMany({
        where: {
          AND: [
            {
              id: {
                equals: postId,
              },
            },
            _.get(req.user, 'role') === role.ADMIN
              ? {}
              : {
                  authorId: {
                    equals: _.get(req.user, 'id'),
                  },
                },
          ],
        },
        data: {
          text,
        },
      });

      return res.status(200).json({
        message: 'Successfully updated',
      });
    } catch (err) {
      return next(err);
    }
  };
}
