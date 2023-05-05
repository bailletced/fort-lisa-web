import prisma from "../src/internal/prismaClient";

const seedUsers = async () => {
  await prisma.user.createMany({
    data: [
      {
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

async function main() {
  console.log(`Start seeding ...`);
  await seedUsers();
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
