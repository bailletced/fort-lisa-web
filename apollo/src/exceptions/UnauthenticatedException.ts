import { GraphQLError } from "graphql";

export class UnauthenticatedException extends GraphQLError {
  constructor() {
    super("Authentication is required to perform this action.", {
      extensions: {
        code: "UNAUTHENTICATED",
      },
    });
    this.name = "UnauthenticatedException";
  }
}
