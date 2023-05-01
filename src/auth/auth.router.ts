import * as express from 'express';

import { AuthController } from './auth.controller';
import { AuthMiddleware } from './auth.middleware';

const router = express.Router();

export class AuthRouter {
  static init(): express.Router {
    /**
     * @swagger
     * /auth/ping:
     *      get:
     *          summary: Ping the Auth Endpoint
     *          tags:
     *              - Auth
     *          description: Ping the Auth Endpoint.
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
     * /auth/signup:
     *      post:
     *          summary: Register User
     *          tags:
     *              - Auth
     *          description: Register User.
     *          requestBody:
     *            description: Request body for user signup
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    name:
     *                      type: string
     *                      example: Rahul
     *                    password:
     *                      type: string
     *                      example: p@$$word
     *                    email:
     *                      type: string
     *                      example: something@gmail.com
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
     *                            example: Registered Successfully
     *              '404':
     *                  description: Not found
     *              '500':
     *                  description: Internal server error
     * */
    router.post('/signup', (req, res, next) =>
      AuthController.registerUser(req, res, next),
    );

    /**
     * @swagger
     * /auth/login:
     *      post:
     *          summary: Login User
     *          tags:
     *              - Auth
     *          description: Login User.
     *          requestBody:
     *            description: Request body for user login
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    email:
     *                      type: string
     *                      example: something@gmail.com
     *                    password:
     *                      type: string
     *                      example: p@$$word
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
     *                            example: Successfully loggedin
     *                          accessToken:
     *                            type: string
     *                            example: AccessT0KeN
     *                          expiresIn:
     *                            type: number
     *                            example: 3600
     *              '404':
     *                  description: Not found
     *              '500':
     *                  description: Internal server error
     * */
    router.post('/login', AuthMiddleware.authLocal, (req, res, next) =>
      AuthController.loginUser(req, res, next),
    );

    return router;
  }
}
