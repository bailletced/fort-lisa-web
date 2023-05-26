import { Ctx, Directive, Mutation, Resolver } from "type-graphql";
import { UserType } from "../../types/UserType";
import { Context } from "../../../context";
import { permissionEnum } from "../../enums/permissionEnum";
import { permissionDirective } from "../../directives/permissionDirective";
import { DIRECTIVES } from "../../directives";

@Resolver()
export class UserMutations {
  @Directive(
    `@${DIRECTIVES.HAS_PERM}(perm: "${permissionEnum.CREATE_UPDATE_USER}")`
  )
  @Mutation(() => UserType, { nullable: true })
  upsertUser(@Ctx() ctx: Context) {
    // if (ctx.user) {

    // }
    return {
      userId: "fozkeofgkz",
      email: "fiozkejfgoizkeg",
    };
  }
}
