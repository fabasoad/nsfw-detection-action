import { createLogger, format, transports } from 'winston'
import { TransformableInfo } from 'logform'

export default class LoggerFactory {
  private static header = 'nsfw-detection-action'

  static create() {
    return createLogger({
      levels: {
        'debug': 0,
        'info': 1,
        'warning': 2,
        'error': 3
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
