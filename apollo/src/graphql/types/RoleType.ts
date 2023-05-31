import { Field, ID, ObjectType } from "type-graphql";
import { ROLE } from "../enums/roleEnum";

@ObjectType()
export class RoleType {
  @Field((type) => ID)
  roleId: string;

  @Field((type) => ROLE)
  name: ROLE;

  @Field((type) => String)
  description: string;

  @Field((type) => String)
  feature: string;

  @Field((type) => String)
  createdAt: string;

  @Field((type) => String)
  updatedAt: string;
}
