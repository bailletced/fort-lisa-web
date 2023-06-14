import { Role, User } from "@prisma/client";
import prismaClient from "../internal/prismaClient";
import { UserInput } from "../graphql/resolvers/user/mutations/upsertUserMutation";
import crypto from "crypto";
import { faker } from "@faker-js/faker";

export class UserModel {
  async getUserRoles(user: User): Promise<Role[]> {
    return await prismaClient.role.findMany({
      where: {
        permissionSetRoleSubscriptions: {
          every: {
            permissionSetRoleSubscriptionId: {
              in: (
                await prismaClient.permissionSetRoleSubscription.findMany({
                  where: {
                    permissionSetId: user.permissionSetId || undefined,
                  },
                })
              ).map((subs) => subs.permissionSetRoleSubscriptionId),
            },
          },
        },
      },
    });
  }

  async createUser(userData: UserInput) {
    const user = await prismaClient.user.findFirst({
      where: { email: userData.email },
    });
    const randomSalt = crypto.randomBytes(16).toString(`hex`);

    return await prismaClient.user.upsert({
      create: {
        email: userData.email,
        name: userData.name,
        salt: randomSalt,
        hashedPassword: crypto
          .pbkdf2Sync(
            userData.password ?? faker.internet.password(),
            randomSalt,
            1000,
            64,
            `sha512`
          )
          .toString(`hex`),
      },
      update: {
        email: userData.email,
        name: userData.name,
        hashedPassword: userData.password
          ? crypto
              .pbkdf2Sync(
                userData.password,
                user?.salt ?? randomSalt,
                1000,
                64,
                `sha512`
              )
              .toString(`hex`)
          : undefined,
        salt: userData.salt ?? undefined,
      },
      where: { email: userData.email },
    });
  }
}
