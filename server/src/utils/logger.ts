export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export class Logger {
  private formatMessage(
    level: LogLevel,
    message: string,
    metadata?: any
  ): string {
    const timestamp = new Date().toISOString();
    let formattedMessage = `${timestamp} [${level}] ${message}`;
    if (metadata) {
      formattedMessage += ` ${JSON.stringify(metadata)}`;
    }
    return formattedMessage;
  }

  info(message: string, metadata?: any) {
    console.log(this.formatMessage(LogLevel.INFO, message, metadata));
  }

  warn(message: string, metadata?: any) {
    console.warn(this.formatMessage(LogLevel.WARN, message, metadata));
  }

  error(message: string, metadata?: any) {
    console.error(this.formatMessage(LogLevel.ERROR, message, metadata));
  }
}

export default new Logger();
