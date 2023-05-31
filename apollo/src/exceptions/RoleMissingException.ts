import { GraphQLError } from "graphql";

export class RoleMissingException extends GraphQLError {
  constructor() {
    super("You are not authorized to perform this action.", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
    this.name = "RoleMissingException";
  }
}
