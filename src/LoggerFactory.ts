import { createLogger, format, transports } from 'winston'
const { combine, timestamp, label, printf } = format;

export default class LoggerFactory {
  static create(clazz: string) {
    const customFormat = printf(({ level, message, label, timestamp }) => {
      timestamp = timestamp.replace(/T/, ' ').replace(/\..+/, '');
      return `${timestamp} [${label}] ${level}: ${message}`;
    });

    return createLogger({
      level: 'debug',
      format: combine(
        label({ label: clazz }),
        timestamp(),
        customFormat
      ),
      transports: [
        new transports.Console()
      ]
    });
  }
}
