import Logger from '../../config/logger.ts';

function describe(detail: unknown): string {
  if (detail instanceof Error) {
    return detail.stack ?? detail.message;
  }
  return typeof detail === 'string' ? detail : JSON.stringify(detail);
}

/** Thin wrapper over the app logger that accepts a message plus optional details. */
const loggerWrapper = {
  info(message: string, context?: string): void {
    Logger.log(message, context);
  },
  error(message: string, detail?: unknown): void {
    Logger.error(detail === undefined ? message : `${message} ${describe(detail)}`);
  }
};

export default loggerWrapper;
