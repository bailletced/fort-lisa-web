import prisma from "../src/internal/prismaClient";
import crypto from "crypto";
const BAILLETCED_ID = crypto.randomUUID();

const seedUsers = async () => {
  await prisma.user.createMany({
    data: [
      {
        userId: BAILLETCED_ID,
        email: "bailletced@gmail.com",
        name: "Cédric",
        isActive: true,
      },
      ...[...Array(10).keys()].map((idx) => {
        return {
          email: `email${idx}@email${idx}.${idx}`,
          name: `FakeUser${idx}`,
          isActive: true,
        };
      }),
    ],
  });
};

const initializePermissionSet = async () => {
  const userFeature = await prisma.feature.create({
    data: {
      featureId: crypto.randomUUID(),
      name: "users",
      description: "users related feature",
    },
  });

  const roleIds = [crypto.randomUUID(), crypto.randomUUID()];
  const roles = await prisma.role.createMany({
    data: [
      {
        roleId: roleIds[0],
        featureId: userFeature.featureId,
        name: "read_users",
        description: "enable to see the list of users",
        order: 1,
      },
      {
        roleId: roleIds[1],
        featureId: userFeature.featureId,
        name: "write_users",
        description: "enable to write users",
        order: 2,
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

  await prisma.permissionSetUserSubscription.create({
    data: {
      permissionSetUserSubscriptionId: crypto.randomUUID(),
      userId: BAILLETCED_ID,
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
