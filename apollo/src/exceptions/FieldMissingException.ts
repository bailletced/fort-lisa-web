import { TExceptionResponse } from "./types";

export class FieldMissingException extends Error {
  status: number;
  response: TExceptionResponse;
  constructor(field: string) {
    const message = `field ${field} is missing`;
    super(message);
    this.status = 400;
    this.name = "FieldMissingException";
    this.response = { message, name: this.name };
  }
}
