import { findManyCursorConnection } from "@devoxa/prisma-relay-cursor-connection";
import { Resolver, Query, Ctx, Directive, Args } from "type-graphql";
import { Context } from "../../../../context";
import prismaClient from "../../../../internal/prismaClient";
import { DIRECTIVES } from "../../../directives";
import { ROLE } from "../../../enums/roleEnum";
import { ForwardPaginationArgs } from "../../../paginations/cursor/cursorPagination";
import { UserConnection } from "../../../types";

@Resolver()
export class UserQueries {
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
        return prismaClient.user.findMany({
          ...args,
          ...baseArgs,
          orderBy: { email: "asc" },
        });
      },

      () => prismaClient.user.count(),
      { after, first },
      {
        getCursor: (user) => ({ id: user.userId }),
      }
    );
  }
}
