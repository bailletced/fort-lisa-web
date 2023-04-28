import { TExceptionResponse } from "./types";

export class UserNotFoundException extends Error {
  status: number;
  response: TExceptionResponse;
  constructor(userEmail: string) {
    const message = `user with email ${userEmail} has not been found`;
    super(message);
    this.status = 404;
    this.name = "UserNotFoundException";
    this.response = { message, name: this.name };
  }
}
