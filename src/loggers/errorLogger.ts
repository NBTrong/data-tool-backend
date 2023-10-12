import { createLogger, format, transports } from 'winston';

const LOG_FILE_PATH = 'logs/error.log';

var logLevel = 'info';
if (process.env.APP_ENV !== 'production') {
  logLevel = 'silly'; // silly
} else {
  logLevel = 'info';
}

const errorLogger = createLogger({
  level: logLevel,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'api' },
  transports: new transports.File({
    filename: LOG_FILE_PATH,
    format: format.combine(
      format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
      format.align(),
      format.printf(
        (info) => `${info.level}: ${[info.timestamp]}: ${info.message}`,
      ),
    ),
  }),
});

// errorLogger.setLevels({
//     debug:0,
//     info: 1,
//     silly:2,
//     warn: 3,
//     error:4,
// });

if (process.env.APP_ENV !== 'production') {
  errorLogger.add(
    new transports.Console({
      level: logLevel || 'silly',

      format: format.combine(
        format.colorize(),
        format.prettyPrint(),
        format.splat(),
        format.printf((info) => {
          if (info instanceof Error) {
            return `[${info.level}] : ${info.timestamp} : ${info.message} ${info.stack}`;
          }
          return `[${info.level}] : ${info.timestamp} :  ${info.message}`;
        }),
      ),
      handleExceptions: true,
    }),
  );
} else {
  errorLogger.add(
    new transports.Console({
      format: format.combine(
        // format.colorize(),
        format.cli(),
      ),
    }),
  );
}

export default errorLogger;
