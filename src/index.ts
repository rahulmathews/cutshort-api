import express, { Express, Request, Response, urlencoded } from 'express';
import dotenv from 'dotenv';
import './db.connect';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import createError from 'http-errors';

import { LoggerUtil, ErrorHandlerUtil, PassportUtil } from './utils';
import { AuthRouter } from './auth';
import { UserRouter } from './user';
import { TodoRouter } from './todo';
import { PostRouter } from './post';
import { CommentRouter } from './comment';

const app: Express = express();

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  }),
);
app.use(express.json());

PassportUtil.init();
LoggerUtil.basicLogger(app);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo Api',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  explorer: true,
  servers: [{ url: 'http://localhost:3000/' }],
  apis: [`./dist/src/**/*.router.js`, './dist/src/index.js'], // files containing annotations as above
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

dotenv.config();

const port = process.env.PORT;

/**
 * @swagger
 * /ping:
 *      get:
 *          summary: Ping the server
 *          tags:
 *              - Ping
 *          description: Ping the server.
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

app.get('/ping', (_req: Request, res: Response) => {
  res.send('pong');
});

app.use('/auth', AuthRouter.init());
app.use('/user', UserRouter.init());
app.use('/todo', TodoRouter.init());
app.use('/post', PostRouter.init());
app.use('/comment', CommentRouter.init());

// catch 404 for routes which are not found and forward to error handler
app.use(function (_req, _res, next) {
  next(createError(404));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

ErrorHandlerUtil.basicErrorHandler(app);
