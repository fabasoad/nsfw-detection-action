import { createLogger, format, transports } from 'winston'
import { Format, TransformableInfo } from 'logform'
const { combine, timestamp, label, printf } = format

export default class LoggerFactory {
  static create(clazz: string) {
    const customFormat: Format = printf((info: TransformableInfo) => {
      const t = (info['timestamp'] as string).replace(/T/, ' ').replace(/\..+/, '')
      return `${t} [${label}] ${info.level}: ${info.message}`
    })

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
    })
  }
}
