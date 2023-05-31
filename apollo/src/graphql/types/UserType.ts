import { Directive, Field, ID, ObjectType } from "type-graphql";
import { ROLE } from "../enums/roleEnum";
import { DIRECTIVES } from "../directives";

@ObjectType()
export class UserType {
  @Field((type) => ID)
  userId: string;

  @Field((type) => String)
  name: string;

  @Field((type) => String)
  email: string;

  @Field((type) => [ROLE!], { nullable: true })
  roles: ROLE[];

  @Field((type) => String)
  createdAt: string;
}
