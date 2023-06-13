import { faker } from "@faker-js/faker";
import { ROLE } from "../../graphql/enums/roleEnum";
import prismaClient from "../../internal/prismaClient";

export async function createUser(email?: string, roles: ROLE[] = []) {
  let permissionSetId = undefined;
  if (roles.length > 0) {
    const insertedRoles = await prismaClient.$transaction(
      roles.map((role) => prismaClient.role.create({ data: { name: role } }))
    );
    permissionSetId = (
      await prismaClient.permissionSet.create({
        data: { name: "permSet" },
      })
    ).permissionSetId;
    await prismaClient.$transaction(
      insertedRoles.map((role) =>
        prismaClient.permissionSetRoleSubscription.create({
          data: {
            permissionSetId,
            roleId: role.roleId,
          },
        })
      )
    );
  }

  return prismaClient.user.create({
    data: {
      email: email ?? faker.internet.email(),
      permissionSetId,
    },
  });
}
