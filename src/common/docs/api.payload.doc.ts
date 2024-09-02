import { HttpStatus } from '@nestjs/common';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export class ApiDocPayload {
  schema: SchemaObject = {};
  status?: HttpStatus | number;

  constructor(example: any, status: HttpStatus = null) {
    this.schema.example = example;

    this.status =
      status ||
      (example?.status == 'error' && example?.code) ||
      example?.statusCode ||
      null;
  }
}
