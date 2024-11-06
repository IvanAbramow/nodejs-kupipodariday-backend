import { HttpException } from '@nestjs/common';

export class ServerException extends HttpException {
  constructor(code: number, message: string) {
    super(message, code);
  }
}
