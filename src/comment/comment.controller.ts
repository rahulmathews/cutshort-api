import * as _ from 'lodash';
import { Request, Response, NextFunction } from 'express';
// import createError from 'http-errors';
import { ModifiedResponse } from '../types/express';
import { Prisma, PrismaClient, role } from '@prisma/client';

export class CommentController {
  static createComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | ModifiedResponse> => {
    try {
      const text = _.get(req.body, 'text');
      const postId = _.get(req.body, 'postId');

      const prisma = new PrismaClient();

      const comment = await prisma.comment.create({
        data: {
          text,
          author: { connect: { id: _.get(req.user, 'id') } },
          post: { connect: { id: postId } },
        },
      });

      return res.status(200).json({
        message: 'Successfully created',
        comment,
      });
    } catch (err) {
      return next(err);
    }
  };

  static fetchAllComments = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | ModifiedResponse> => {
    try {
      let page = req.query.page as string | number;
      let limit = req.query.limit as string | number;
      const search = req.query.search as string;
      const postId = req.query.postId as string;

      if (_.isNil(page)) {
        page = 1;
      }

      if (_.isNil(limit)) {
        limit = 10;
      }

      page = parseInt(page as string);
      limit = parseInt(limit as string);

      const prisma = new PrismaClient();

      let filterObj: Prisma.CommentWhereInput = {};

      if (_.get(req.user, 'role') === role.ADMIN) {
        if (search && !_.isNil(postId)) {
          filterObj = {
            AND: [
              {
                text: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                postId: {
                  equals: postId,
                },
              },
            ],
          };
        } else if (search && _.isNil(postId)) {
          filterObj = {
            text: {
              contains: search,
              mode: 'insensitive',
            },
          };
        } else if (!search && !_.isNil(postId)) {
          filterObj = {
            postId: {
              equals: postId,
            },
          };
        }
      } else {
        if (search) {
          filterObj = {
            AND: [
              {
                text: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                authorId: {
                  equals: _.get(req.user, 'id'),
                },
              },
            ],
          };

          if (postId) {
            filterObj = {
              AND: [
                {
                  text: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
                {
                  authorId: {
                    equals: _.get(req.user, 'id'),
                  },
                },
                {
                  postId: {
                    equals: postId,
                  },
                },
              ],
            };
          }
        } else {
          if (postId) {
            filterObj = {
              AND: [
                {
                  authorId: {
                    equals: _.get(req.user, 'id'),
                  },
                },
                {
                  postId: {
                    equals: postId,
                  },
                },
              ],
            };
          } else {
            filterObj = {
              authorId: {
                equals: _.get(req.user, 'id'),
              },
            };
          }
        }
      }

      const comments = await prisma.comment.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: filterObj,
      });

      return res.status(200).json({
        comments,
        current_page: page,
      });
    } catch (err) {
      return next(err);
    }
  };

  static modifyComment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | ModifiedResponse> => {
    try {
      const commentId = _.get(req.params, 'id');

      const text: string = _.get(req.body, 'text');

      const prisma = new PrismaClient();

      await prisma.comment.updateMany({
        where: {
          AND: [
            {
              id: {
                equals: commentId,
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
