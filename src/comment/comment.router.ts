import * as express from 'express';

import { CommentController } from './comment.controller';
import { AuthMiddleware } from '../auth/auth.middleware';

const router = express.Router();

export class CommentRouter {
  static init(): express.Router {
    /**
     * @swagger
     *
     * /comment/ping:
     *      get:
     *          summary: Ping the Comment Endpoint
     *          tags:
     *              - Comment
     *          description: Ping the Comment Endpoint.
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
     * /comment:
     *      post:
     *          security:
     *            - bearerAuth: []
     *          summary: Create Comment
     *          tags:
     *              - Comment
     *          description: Create Comment.
     *          requestBody:
     *            description: Request body to create Comment
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    text:
     *                      type: string
     *                      example: This is a Comment A
     *                    postId:
     *                      type: string
     *                      example: 6acd3342deba72cdaef
     *          responses:
     *              '200':
     *                 description: OK
     *                 content:
     *                    application/json:
     *                      schema:
     *                        type: object
     *                        properties:
     *                          comment:
     *                            type: object
     *                            properties:
     *                              id:
     *                                type: string
     *                                example: 6acd3342deba72cdaef
     *                              text:
     *                                type: string
     *                                example: This is a Comment A
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
      CommentController.createComment(req, res, next),
    );

    /**
     * @swagger
     * /comment/{id}:
     *      post:
     *          security:
     *            - bearerAuth: []
     *          summary: Update Comment
     *          tags:
     *              - Comment
     *          description: Update Comment.
     *          parameters:
     *            - in : path
     *              name: id
     *              schema:
     *                type: string
     *                example: 6acd3342deba72cdaeb
     *          requestBody:
     *            description: Request body for Comment update
     *            content:
     *              application/json:
     *                schema:
     *                  type: object
     *                  properties:
     *                    text:
     *                      type: string
     *                      example: Updated Comment B
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
      CommentController.modifyComment(req, res, next),
    );

    /**
     * @swagger
     * /comment:
     *      get:
     *          security:
     *            - bearerAuth: []
     *          summary: Fetch comments
     *          tags:
     *              - Comment
     *          description: Fetch comments.
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
     *                example: comment
     *              description: Search value for comment
     *            - in: query
     *              name: postId
     *              schema:
     *                type: string
     *                example: 6acd3342deba72cdaec
     *              description: Id of post
     *          responses:
     *              '200':
     *                 description: OK
     *                 content:
     *                    application/json:
     *                      schema:
     *                        type: object
     *                        properties:
     *                          comments:
     *                            type: array
     *                            items:
     *                              type: object
     *                            example:
     *                              - id: 6acd3342deba72cdaef
     *                                text: comment A
     *                              - id: 6acd3342deba72cdaec
     *                                text: comment B
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
      CommentController.fetchAllComments(req, res, next),
    );

    return router;
  }
}
