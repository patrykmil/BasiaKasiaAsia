import morgan from 'morgan';
import logger from '../config/logger';

export class LoggerMiddleware {
  private morganFormat: string;

  constructor() {
    this.morganFormat =
      ':remote-addr :method :url :status :res[content-length] - :response-time ms';
  }

  /**
   * Create a stream object for morgan that uses winston
   */
  private createStream() {
    return {
      write: (message: string) => {
        // Remove trailing newline that morgan adds
        logger.http(message.trim());
      },
    };
  }

  /**
   * Get the morgan middleware handler
   */
  public getMiddleware() {
    return morgan(this.morganFormat, { stream: this.createStream() });
  }
}

// Singleton instance
const loggerMiddleware = new LoggerMiddleware();

// Backward-compatible export
export const morganMiddleware = loggerMiddleware.getMiddleware();

export default loggerMiddleware;
