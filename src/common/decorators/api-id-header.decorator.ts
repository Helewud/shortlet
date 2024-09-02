import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function ApiIdHeader(): MethodDecorator & ClassDecorator {
  return applyDecorators(
    ApiHeader({
      name: 'id',
      description: 'Profile Id',
      required: true,
    }),
  );
}
