import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import Env from '../shared/utils/env.ts';
import LokiTransport from 'winston-loki';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const { level, message, timestamp } = info;
    return `${timestamp} | ${level}: ${message}`;
  })
);

const infoLogRotationTransport = new DailyRotateFile({
  filename: 'logs/info',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '10m',
  maxFiles: '80d',
  level: 'info',
  extension: '.log'
});

const errorLogRotationTransport = new DailyRotateFile({
  filename: 'logs/error',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '10m',
  maxFiles: '80d',
  level: 'error',
  extension: '.log'
});

const loggerInfo = (env: string) => {
  let logger;
  switch (env) {
    case 'production':
      logger = winston.createLogger({
        level: 'info',
        format: logFormat,
        transports: [infoLogRotationTransport, errorLogRotationTransport],
        exitOnError: false
      });
      break;
    case 'development':
      logger = winston.createLogger({
        level: 'info',
        format: logFormat,
        transports: [infoLogRotationTransport, errorLogRotationTransport, new winston.transports.Console()],
        exitOnError: false
      });
      break;
    case 'staging': {
      const lokiHost = Env.get<string>('LOKI_HOST');
      const lokiTransporter = lokiHost
        ? new LokiTransport({
            host: lokiHost,
            labels: { project: `jollivo-${env}-backend`, env },
            batching: true,
            interval: 5
          })
        : null;

      logger = winston.createLogger({
        level: 'info',
        format: logFormat,
        transports: [
          infoLogRotationTransport,
          errorLogRotationTransport,
          ...(lokiTransporter ? [lokiTransporter] : []),
          new winston.transports.Console()
        ],
        exitOnError: false
      });
      break;
    }
    case 'test':
      logger = winston.createLogger({
        level: 'info',
        format: logFormat,
        transports: [
          infoLogRotationTransport,
          errorLogRotationTransport,
          new winston.transports.File({
            filename: 'logs/error.log',
            maxsize: 500,
            format: logFormat
          })
        ],
        exitOnError: false
      });
      break;
    default:
      logger = winston.createLogger({
        level: 'info',
        format: logFormat,
        transports: [infoLogRotationTransport, errorLogRotationTransport, new winston.transports.Console()],
        exitOnError: false
      });
  }

  return logger;
};

const logger = loggerInfo(Env.get<string>('NODE_ENV') ?? 'development');
export default class Logger {
  private readonly defaultContext: string;

  constructor(defaultContext: string) {
    this.defaultContext = defaultContext;
  }

  public static log(message: string | any, context?: string): void {
    logger.info(message, { label: context });
  }

  public static error(err: any): void {
    logger.error(err);
  }

  public log(message: string | any, context?: string) {
    logger.info(message, { label: context ?? this.defaultContext });
  }

  public error(err: any): void {
    logger.error(err);
  }
}
