import * as express from 'express';

import { TodoController } from './todo.controller';
import { AuthMiddleware } from '../auth/auth.middleware';

const router = express.Router();

export class TodoRouter {
  static init(): express.Router {
    /**
     * @swagger
     *
     * /todo/ping:
     *      get:
     *          summary: Ping the Todo Endpoint
     *          tags:
     *              - Todo
     *          description: Ping the Todo Endpoint.
     *          responses:
     *              '200':
     *                 description: OK
     *                 content:
     *                    text/plain:
     *                      schema:
     *                        type: string
     *                        example: pong
     *              '404':
     *                  description: Not found
     *              '500':
     *                  description: Internal server error
     * */
    router.get('/ping', function (_req, res) {
      res.send('pong');
    });

    /**
     * @swagger
     * /todo:
     *      post:
     *          security:
     *            - bearerAuth: []
     *          summary: Create Todo
     *          tags:
     *              - Todo
     *          description: Create Todo.
     *          requestBody:
     *            description: Request body to create todo
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    text:
     *                      type: string
     *                      example: complete a Task A
     *          responses:
     *              '200':
     *                 description: OK
     *                 content:
     *                    application/json:
     *                      schema:
     *                        type: object
     *                        properties:
     *                          todo:
     *                            type: object
     *                            properties:
     *                              id:
     *                                type: string
     *                                example: 6acd3342deba72cdaef
     *                              text:
     *                                type: string
     *                                example: complete a Task A
     *                          message:
     *                            type: string
     *                            example: Successfully created
     *
     *              '404':
     *                  description: Not found
     *              '500':
     *                  description: Internal server error
     * */
    router.post('/', AuthMiddleware.authJwt, (req, res, next) =>
      TodoController.createTodo(req, res, next),
    );

    /**
     * @swagger
     * /todo/{id}:
     *      post:
     *          security:
     *            - bearerAuth: []
     *          summary: Update todo
     *          tags:
     *              - Todo
     *          description: Update todo.
     *          parameters:
     *            - in : path
     *              name: id
     *              schema:
     *                type: string
     *                example: 6acd3342deba72cdaeb
     *          requestBody:
     *            description: Request body for todo update
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    text:
     *                      type: string
     *                      example: Complete Task B
     *                    status:
     *                      type: string
     *                      enum: ['TODO', 'DONE']
     *          responses:
     *              '200':
     *                 description: OK
     *                 content:
     *                    application/json:
     *                      schema:
     *                        type: object
     *                        properties:
     *                          message:
     *                            type: string
     *                            example: Successfully updated
     *
     *              '404':
     *                  description: Not found
     *              '500':
     *                  description: Internal server error
     * */
    router.post('/:id', AuthMiddleware.authJwt, (req, res, next) =>
      TodoController.modifyTodo(req, res, next),
    );

    /**
     * @swagger
     * /todo:
     *      get:
     *          security:
     *            - bearerAuth: []
     *          summary: Fetch todos
     *          tags:
     *              - Todo
     *          description: Fetch todos.
     *          parameters:
     *            - in: query
     *              name: page
     *              schema:
     *                type: integer
     *                default: 1
     *              description: Page to return
     *            - in: query
     *              name: limit
     *              schema:
     *                type: integer
     *                default: 10
     *              description: Number of items to return
     *            - in: query
     *              name: search
     *              schema:
     *                type: string
     *                example: todo
     *              description: Search value for todo
     *          responses:
     *              '200':
     *                 description: OK
     *                 content:
     *                    application/json:
     *                      schema:
     *                        type: object
     *                        properties:
     *                          todos:
     *                            type: array
     *                            items:
     *                              type: object
     *                            example:
     *                              - id: 6acd3342deba72cdaef
     *                                text: task A
     *                              - id: 6acd3342deba72cdaec
     *                                text: task B
     *                          current_page:
     *                            type: number
     *                            example: 10
     *
     *              '404':
     *                  description: Not found
     *              '500':
     *                  description: Internal server error
     * */
    router.get('/', AuthMiddleware.authJwt, (req, res, next) =>
      TodoController.fetchAllTodos(req, res, next),
    );

    /**
     * @swagger
     * /todo/{id}:
     *      delete:
     *          security:
     *            - bearerAuth: []
     *          summary: Delete todo
     *          tags:
     *              - Todo
     *          description: Delete todo.
     *          parameters:
     *            - in: path
     *              name: id
     *              schema:
     *                type: string
     *                example: 6acd3342deba72cdaef
     *          responses:
     *              '200':
     *                 description: OK
     *                 content:
     *                    application/json:
     *                      schema:
     *                        type: object
     *                        properties:
     *                          message:
     *                            type: string
     *                            example: Successfully deleted
     *
     *              '404':
     *                  description: Not found
     *              '500':
     *                  description: Internal server error
     * */
    router.delete('/:id', AuthMiddleware.authJwt, (req, res, next) =>
      TodoController.deleteTodo(req, res, next),
    );

    return router;
  }
}
