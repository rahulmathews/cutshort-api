import * as express from 'express';

import { UserController } from './user.controller';
import { UserMiddleware } from './user.middleware';
import { AuthMiddleware } from '../auth/auth.middleware';

const router = express.Router();

export class UserRouter {
  static init(): express.Router {
    /**
     * @swagger
     *
     * /user/ping:
     *      get:
     *          summary: Ping the User Endpoint
     *          tags:
     *              - User
     *          description: Ping the User Endpoint.
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
     * /user:
     *      get:
     *          security:
     *            - bearerAuth: []
     *          summary: Fetch all users
     *          tags:
     *              - User
     *          description: Fetch all users.
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
     *          responses:
     *              '200':
     *                 description: OK
     *                 content:
     *                    application/json:
     *                      schema:
     *                        type: object
     *                        properties:
     *                          users:
     *                            type: array
     *                            items:
     *                              type: object
     *                            example:
     *                              - id: 6acd3342deba72cdaef
     *                                email: something1@gmail.com
     *                              - id: 6acd3342deba72cdaec
     *                                email: something2@gmail.com
     *                          current_page:
     *                            type: number
     *                            example: 10
     *
     *              '404':
     *                  description: Not found
     *              '500':
     *                  description: Internal server error
     * */
    router.get(
      '/',
      AuthMiddleware.authJwt,
      UserMiddleware.allowOnlyAdmin,
      (req, res, next) => UserController.fetchAllUsers(req, res, next),
    );

    /**
     * @swagger
     * /user/{id}:
     *      post:
     *          security:
     *            - bearerAuth: []
     *          summary: Update User
     *          tags:
     *              - User
     *          description: Update User.
     *          parameters:
     *            - in : path
     *              name: id
     *              schema:
     *                type: string
     *                example: 6acd3342deba72cdaeb
     *          requestBody:
     *            description: Request body for user update
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    email:
     *                      type: string
     *                      example: something@gmail.com
     *                    role:
     *                      type: string
     *                      example: USER
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
     *                          user:
     *                            type: object
     *                            properties:
     *                              id:
     *                                type: string
     *                                example: 62abc22cae2de52ecab
     *                              email:
     *                                type: string
     *                                example: something23@gmail.com
     *
     *              '404':
     *                  description: Not found
     *              '500':
     *                  description: Internal server error
     * */
    router.post(
      '/:id',
      AuthMiddleware.authJwt,
      UserMiddleware.allowOnlyAdmin,
      (req, res, next) => UserController.modifyUser(req, res, next),
    );

    return router;
  }
}
