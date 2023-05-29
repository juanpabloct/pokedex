import {
  ArgumentMetadata,
  ForbiddenException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class TransformNumberPipe implements PipeTransform {
  transform<T>(value: T, metadata: ArgumentMetadata) {
    if (!isNaN(+value) || undefined === value) {
      return value && +value;
    } else {
      throw new ForbiddenException('Not is number');
    }
  }
}
