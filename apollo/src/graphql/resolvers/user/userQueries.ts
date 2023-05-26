import { Ctx, Query, Resolver } from "type-graphql";
import { UserType } from "../../types/UserType";
import { Context } from "../../../context";

@Resolver()
export class UserQueries {
  @Query(() => UserType, { nullable: true })
  me(@Ctx() ctx: Context) {
    return ctx.user;
  }
}
