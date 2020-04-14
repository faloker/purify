import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.BAD_REQUEST;

    switch (exception.code) {
      case 11000:
        response.code(status).send({
          statusCode: status,
          message: `${exception.errmsg.match(/\{\s.+\s\}/g)[0]} already exists`
        });
    }
  }
}
