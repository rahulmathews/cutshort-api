import morgan from 'morgan';
import { Express } from 'express';

/**
 * This constructs Logger Utils class
 * @returns
 */
export class LoggerUtil {
  static basicLogger = (app: Express): void => {
    const logger = {
      write: function (msg: string): void {
        console.log(msg.trimEnd());
      },
    };

    app.use(
      morgan(':method :url :status :response-time ms', { stream: logger }),
    );
  };
}
