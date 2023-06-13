import { GraphQLError } from "graphql";

export class RoleMissingException extends GraphQLError {
  constructor() {
    super("role.missing", {
      extensions: {
        code: "FORBIDDEN",
      },
    });
    this.name = "RoleMissingException";
  }
}
