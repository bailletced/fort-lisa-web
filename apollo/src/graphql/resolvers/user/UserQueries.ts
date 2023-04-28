// import { extendType } from "nexus";
// import { Context } from "../../context";
// import prismaClient from "../../internal/prismaClient";
// import { UserType } from "../types";

import { Query, Resolver } from "type-graphql";
import { UserType } from "../../types/UserType";

// export const MeQuery = extendType({
//   type: "Query",
//   definition(t) {
//     t.field("me", {
//       type: UserType,
//       resolve: async (parent, args, context: Context) => {
//         const user = await prismaClient.user.findFirst({
//           where: {
//             userId: context.user.userId,
//           },
//         });

//         return user;
//       },
//     });
//   },
// });

@Resolver()
export class UserQueries {
  private mee: UserType = {
    userId: "1",
    email: "toto@toto.com",
    name: "cédric",
    idAdmin: true,
    createdAt: "now",
  };

  @Query(() => UserType)
  me() {
    return this.mee;
  }

  @Query(() => String)
  test() {
    return "test";
  }
}
