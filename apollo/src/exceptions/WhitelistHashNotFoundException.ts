import { GraphQLError } from "graphql";

export class WhitelistHashNotFoundException extends GraphQLError {
  constructor(hash: string) {
    super(`The hash ${hash} has not been found`, {
      extensions: {
        code: "QueryNotFoundException",
      },
    });
    this.name = "WhitelistHashNotFoundException";
  }
}
