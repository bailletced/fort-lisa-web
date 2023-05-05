import { Ctx, Query, Resolver } from "type-graphql";
import { UserType } from "../../types/UserType";
import { Context } from "../../../context";

@Resolver()
export class UserQueries {
  @Query(() => UserType)
  me(@Ctx() ctx: Context) {
    return ctx?.user;
  }

  @Query(() => String)
  test() {
    return "test";
  }
}
