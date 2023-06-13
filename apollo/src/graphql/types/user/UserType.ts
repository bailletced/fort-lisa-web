import { Field, ID, ObjectType } from "type-graphql";
import {
  ConnectionType,
  EdgeType,
} from "../../paginations/cursor/cursorPagination";
import prismaClient from "../../../internal/prismaClient";
import { PermissionSet } from "@prisma/client";
import { PermissionSet as PermissionSetType } from "../permission/PermissionSetType";

@ObjectType()
export class UserType {
  @Field((type) => ID)
  userId: string;

  @Field((type) => String)
  name: string;

  @Field((type) => String)
  email: string;

  @Field((type) => String)
  permissionSetId: string;

  @Field((type) => PermissionSetType, { nullable: true })
  async permissionSet(): Promise<PermissionSet> {
    return await prismaClient.permissionSet.findUnique({
      where: { permissionSetId: this?.permissionSetId || undefined },
    });
  }

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
