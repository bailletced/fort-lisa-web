import { TExceptionResponse } from "./types";

export class WhitelistHashNotFoundException extends Error {
  status: number;
  response: TExceptionResponse;
  constructor(queryHash: string) {
    const message = `No hash asociated to ${queryHash}`;
    super(message);
    this.status = 404;
    this.name = "WhitelistHashNotFoundException";
    this.response = { message, name: this.name };
  }
}
