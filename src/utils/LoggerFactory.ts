import { createLogger, format, transports } from 'winston'
import { TransformableInfo } from 'logform'

export default class LoggerFactory {
  private static header = 'nsfw-detection-action'

  static create() {
    return createLogger({
      level: 'debug',
      levels: {
        'error': 1,
        'warning': 2,
        'info': 3,
        'debug': 4
      },
      format: format.printf((info: TransformableInfo) => {
        const t = (info['timestamp'] as string).replace(/T/, ' ').replace(/\..+/, '')
        return `[${info.level}] [${LoggerFactory.header}] ${t} ${info.message}`
      }),
      transports: [
        new transports.Console()
      ]
    })
  }
}
