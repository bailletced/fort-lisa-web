import { TExceptionResponse } from "./types";

export class UserAlreadyExistException extends Error {
  status: number;
  response: TExceptionResponse;
  constructor(userEmail: string) {
    const message = `user with email ${userEmail} already exists`;
    super(message);
    this.status = 400;
    this.name = "UserAlreadyExistException";
    this.response = { message, name: this.name };
  }
}
