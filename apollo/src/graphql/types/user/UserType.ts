import { Directive, Field, ID, ObjectType } from "type-graphql";
import { ROLE } from "../../enums/roleEnum";
import { DIRECTIVES } from "../../directives";
import {
  ConnectionType,
  EdgeType,
} from "../../paginations/cursor/cursorPagination";

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

@ObjectType()
export class ItemEdge extends EdgeType(UserType) {}

@ObjectType()
export class UserConnection extends ConnectionType({
  edge: ItemEdge,
  node: UserType,
}) {}
