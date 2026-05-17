import morgan from 'morgan';
import logger from '../config/logger';

// Create a stream object for morgan that uses winston
const stream = {
  write: (message: string) => {
    // Remove trailing newline that morgan adds
    logger.http(message.trim());
  },
};

// Define the format for morgan
const morganFormat = ':remote-addr :method :url :status :res[content-length] - :response-time ms';

// Create the morgan middleware
export const morganMiddleware = morgan(morganFormat, { stream });
