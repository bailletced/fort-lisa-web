import { Ctx, Directive, Mutation, Resolver } from "type-graphql";
import { UserType } from "../../types/user/UserType";
import { Context } from "../../../context";
import { DIRECTIVES } from "../../directives";
import { ROLE } from "../../enums/roleEnum";

@Resolver()
export class UserMutations {
  @Directive(
    `@${DIRECTIVES.HAS_PERM}(perm: "${ROLE.WRITE_USERS}", onFailure: "throw")`
  )
  @Mutation(() => UserType, { nullable: true })
  upsertUser(@Ctx() ctx: Context) {
    return {
      userId: "fozkeofgkz",
      email: "fiozkejfgoizkeg",
    };
  }
}
