import { Ctx, Field, ID, ObjectType } from "type-graphql";
import { ROLE } from "../../enums/roleEnum";
import prismaClient from "../../../internal/prismaClient";
import { PermissionSetRoleSubscription } from "@prisma/client";
import { Context } from "../../../context";
import DataLoader from "dataloader";

@ObjectType()
export class PermissionSet {
  @Field((type) => ID)
  permissionSetId: string;

  @Field((type) => String)
  name: string;

  @Field((type) => [ROLE!], { nullable: true })
  async roles(@Ctx() ctx: Context): Promise<ROLE[]> {
    return (
      await ctx.dataSources.roleLoader.getRolesFromPermissionSet(
        this.permissionSetId
      )
    )[0];
  }
}
