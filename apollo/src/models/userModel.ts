import { Role, User } from "@prisma/client";
import prismaClient from "../internal/prismaClient";

export async function getUserRoles(user: User): Promise<Role[]> {
  return await prismaClient.role.findMany({
    where: {
      permissionSetRoleSubscriptions: {
        every: {
          permissionSetRoleSubscriptionId: {
            in: (
              await prismaClient.permissionSetRoleSubscription.findMany({
                where: {
                  permissionSetId: user.permissionSetId,
                },
              })
            ).map((subs) => subs.permissionSetRoleSubscriptionId),
          },
        },
      },
    },
  });
}
