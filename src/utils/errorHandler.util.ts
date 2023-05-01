import { Express, NextFunction, Request, Response } from 'express';

export class ErrorHandlerUtil {
  static basicErrorHandler = (app: Express): void => {
    app.use(function (
      err: Error & { message: string; status: number },
      req: Request,
      res: Response,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _next: NextFunction,
    ) {
      // set locals, only providing error in development
      app.locals.message = err && err.message;
      app.locals.error = req.app.get('env') === 'development' ? err : {};

      console.error(err);
      // render the error page
      return res.status(err.status || 500).json({ message: err.message });
    });
  };
}
