import { registerEnumType } from "type-graphql";

export enum ROLE {
  READ_USERS = "READ_USERS",
  WRITE_USERS = "WRITE_USERS",
}

registerEnumType(ROLE, {
  name: "Roles",
  description: "All available roles",
});
