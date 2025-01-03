import { createLogger, format, Logger, transports } from 'winston'
import { TransformableInfo } from 'logform'

const header = 'nsfw-detection-action'
const logger: Logger = createLogger({
  level: 'debug',
  levels: {
    error: 1,
    warning: 2,
    info: 3,
    debug: 4
  },
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp }: TransformableInfo) => {
      const levelHeader = level[0].toUpperCase() + level.slice(1)
      return `${levelHeader}: [${header}] ${timestamp} ${message}`
    })
  ),
  transports: [
    new transports.Console()
  ]
})

export function getLogger(): Logger {
  return logger
}
