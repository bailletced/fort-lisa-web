// import { queryField } from "nexus";
// import prismaClient from "../../internal/prismaClient";
// import {
//   extractIdFromCursor,
//   generateArgumentsForConnection,
// } from "../helpers/paginationConnection";
// import { UserType } from "../types";

// export const usersQueryField = queryField((t) => {
//   t.connectionField("user", {
//     type: UserType,
//     async nodes(root, args, ctx, info) {
//       const id = extractIdFromCursor(args);
//       return await prismaClient.user.findMany(
//         generateArgumentsForConnection(
//           args,
//           id ? { key: "userId", value: id } : null
//         )
//       );
//     },
//     async totalCount() {
//       return await prismaClient.user.count();
//     },
//   });
// });
