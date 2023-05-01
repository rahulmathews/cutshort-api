import * as _ from 'lodash';
import { Request, Response, NextFunction } from 'express';
// import createError from 'http-errors';
import { ModifiedResponse } from '../types/express';
import { PrismaClient, role, status } from '@prisma/client';

export class TodoController {
  static createTodo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | ModifiedResponse> => {
    try {
      const text = _.get(req.body, 'text');

      const prisma = new PrismaClient();

      const todo = await prisma.todo.create({
        data: {
          text,
          author: { connect: { id: _.get(req.user, 'id') } },
        },
      });

      return res.status(200).json({
        message: 'Successfully created',
        todo,
      });
    } catch (err) {
      return next(err);
    }
  };

  static fetchAllTodos = async (
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

      const todos = await prisma.todo.findMany({
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
        todos,
        current_page: page,
      });
    } catch (err) {
      return next(err);
    }
  };

  static modifyTodo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | ModifiedResponse> => {
    try {
      const todoId = _.get(req.params, 'id');

      const text: string = _.get(req.body, 'text');
      const status: status = _.get(req.body, 'status');

      const prisma = new PrismaClient();

      await prisma.todo.updateMany({
        where: {
          AND: [
            {
              id: {
                equals: todoId,
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
          status,
        },
      });

      return res.status(200).json({
        message: 'Successfully updated',
      });
    } catch (err) {
      return next(err);
    }
  };

  static deleteTodo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void | ModifiedResponse> => {
    try {
      const todoId = _.get(req.params, 'id');

      const prisma = new PrismaClient();

      await prisma.todo.deleteMany({
        where: {
          AND: [
            {
              id: {
                equals: todoId,
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
      });

      return res.status(200).json({
        message: 'Successfully deleted',
      });
    } catch (err) {
      return next(err);
    }
  };
}
