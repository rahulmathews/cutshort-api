import * as express from 'express';

import { PostController } from './post.controller';
import { AuthMiddleware } from '../auth/auth.middleware';

const router = express.Router();

export class PostRouter {
  static init(): express.Router {
    /**
     * @swagger
     *
     * /post/ping:
     *      get:
     *          summary: Ping the Post Endpoint
     *          tags:
     *              - Post
     *          description: Ping the Post Endpoint.
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
     * /post:
     *      post:
     *          security:
     *            - bearerAuth: []
     *          summary: Create Post
     *          tags:
     *              - Post
     *          description: Create Post.
     *          requestBody:
     *            description: Request body to create Post
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    text:
     *                      type: string
     *                      example: This is a Post A
     *          responses:
     *              '200':
     *                 description: OK
     *                 content:
     *                    application/json:
     *                      schema:
     *                        type: object
     *                        properties:
     *                          post:
     *                            type: object
     *                            properties:
     *                              id:
     *                                type: string
     *                                example: 6acd3342deba72cdaef
     *                              text:
     *                                type: string
     *                                example: This is a Post A
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
      PostController.createPost(req, res, next),
    );

    /**
     * @swagger
     * /post/{id}:
     *      post:
     *          security:
     *            - bearerAuth: []
     *          summary: Update post
     *          tags:
     *              - Post
     *          description: Update post.
     *          parameters:
     *            - in : path
     *              name: id
     *              schema:
     *                type: string
     *                example: 6acd3342deba72cdaeb
     *          requestBody:
     *            description: Request body for post update
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    text:
     *                      type: string
     *                      example: Updated Post B
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
      PostController.modifyPost(req, res, next),
    );

    /**
     * @swagger
     * /post:
     *      get:
     *          security:
     *            - bearerAuth: []
     *          summary: Fetch posts
     *          tags:
     *              - Post
     *          description: Fetch posts.
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
     *                example: post
     *              description: Search value for post
     *          responses:
     *              '200':
     *                 description: OK
     *                 content:
     *                    application/json:
     *                      schema:
     *                        type: object
     *                        properties:
     *                          posts:
     *                            type: array
     *                            items:
     *                              type: object
     *                            example:
     *                              - id: 6acd3342deba72cdaef
     *                                text: post A
     *                              - id: 6acd3342deba72cdaec
     *                                text: post B
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
      PostController.fetchAllPosts(req, res, next),
    );

    return router;
  }
}
