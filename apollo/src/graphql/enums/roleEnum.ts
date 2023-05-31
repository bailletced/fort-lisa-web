import { registerEnumType } from "type-graphql";

export enum ROLE {
  READ_USERS = "read_users",
  WRITE_USERS = "write_users",
}

registerEnumType(ROLE, {
  name: "Roles",
  description: "All available roles",
});
