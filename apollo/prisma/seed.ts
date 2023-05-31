import { faker } from "@faker-js/faker";
import prismaClient from "../src/internal/prismaClient";
import prisma from "../src/internal/prismaClient";
import crypto from "crypto";
const BAILLETCED_ID = crypto.randomUUID();
const BAILLETCED_SALT = crypto.randomBytes(16).toString(`hex`);

const seedUsers = async () => {
  await prisma.user.createMany({
    data: [
      {
        userId: BAILLETCED_ID,
        email: "bailletced@gmail.com",
        name: "Cédric",
        isActive: true,
        salt: BAILLETCED_SALT,
        hashedPassword: crypto
          .pbkdf2Sync("bailletced", BAILLETCED_SALT, 1000, 64, `sha512`)
          .toString(`hex`),
      },
      ...[...Array(10).keys()].map((idx) => {
        return {
          email: faker.internet.email(),
          name: faker.internet.userName(),
          isActive: true,
          salt: crypto.randomBytes(16).toString(`hex`),
          hashedPassword: crypto
            .pbkdf2Sync(
              faker.internet.password(),
              crypto.randomBytes(16).toString(`hex`),
              1000,
              64,
              `sha512`
            )
            .toString(`hex`),
        };
      }),
    ],
  });
};

const initializePermissionSet = async () => {
  const roleIds = [crypto.randomUUID(), crypto.randomUUID()];
  await prisma.role.createMany({
    data: [
      {
        roleId: roleIds[0],
        name: "read_users",
        description: "enable to see the list of users",
        feature: "user_list",
      },
      {
        roleId: roleIds[1],
        name: "write_users",
        description: "enable to write users",
        feature: "user_list",
      },
    ],
  });

  const adminPermSet = await prisma.permissionSet.create({
    data: {
      permissionSetId: crypto.randomUUID(),
      name: "admin",
      description: "Has all priviledges",
    },
  });

  await prisma.permissionSetRoleSubscription.createMany({
    data: roleIds.map((roleId) => {
      return {
        permissionSetId: adminPermSet.permissionSetId,
        roleId,
      };
    }),
  });

  await prismaClient.user.update({
    where: {
      userId: BAILLETCED_ID,
    },
    data: {
      permissionSetId: adminPermSet.permissionSetId,
    },
  });
};

async function main() {
  console.log(`Start seeding ...`);
  await seedUsers();
  await initializePermissionSet();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
