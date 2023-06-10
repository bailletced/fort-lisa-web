import { Args, Ctx, Directive, Query, Resolver } from "type-graphql";
import { UserConnection, UserType } from "../../types/user/UserType";
import { Context } from "../../../context";
import { findManyCursorConnection } from "@devoxa/prisma-relay-cursor-connection";
import prismaClient from "../../../internal/prismaClient";
import { ForwardPaginationArgs } from "../../paginations/cursor/cursorPagination";
import { DIRECTIVES } from "../../directives";
import { ROLE } from "../../enums/roleEnum";

@Resolver()
export class UserQueries {
  @Query(() => UserType, { nullable: true })
  me(@Ctx() ctx: Context) {
    return ctx.user;
  }

  @Directive(
    `@${DIRECTIVES.HAS_PERM}(perm: "${ROLE.READ_USERS}", onFailure: "throw")`
  )
  @Query(() => UserConnection, { nullable: true })
  async users(
    @Ctx() ctx: Context,
    @Args((type) => ForwardPaginationArgs)
    { after, first }
  ) {
    return await findManyCursorConnection(
      (args) => {
        const baseArgs = {
          cursor: args.cursor
            ? {
                userId: args.cursor?.id,
              }
            : undefined,
        };
        return prismaClient.user.findMany({ ...args, ...baseArgs });
      },

      () => prismaClient.user.count(),
      { after, first },
      {
        getCursor: (user) => ({ id: user.userId }),
      }
    );
  }
}
