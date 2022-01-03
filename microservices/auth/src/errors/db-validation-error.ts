import { CustomError } from './custom-errors'
export class DatabaseConnectionError extends CustomError {
  reason = 'Error Connecting to DB'
  statusCode = 500
  constructor() {
    super('Error Connecting to DB')

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }
  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ]
  }
}
