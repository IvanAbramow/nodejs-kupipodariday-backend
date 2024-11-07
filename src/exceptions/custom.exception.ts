import { HttpException } from '@nestjs/common';
import { ERROR_MESSAGE_WITH_CODE } from '../config/errors';

export class CustomException extends HttpException {
  constructor(errorMessage: string) {
    super(errorMessage, ERROR_MESSAGE_WITH_CODE.get(errorMessage) || 500);
  }
}
