import { Resolver, Query, Ctx } from "type-graphql";
import { Context } from "../../../../context";
import { UserType } from "../../../types";

@Resolver()
export class MeQuery {
  @Query(() => UserType, { nullable: true })
  me(@Ctx() ctx: Context) {
    return ctx.user;
  }
}
