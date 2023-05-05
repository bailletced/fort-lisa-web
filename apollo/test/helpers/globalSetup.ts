import { join } from "path";
import { execSync } from "child_process";
import prismaClient from "../../src/internal/prismaClient";

const prismaBinary = join(process.cwd(), "node_modules", ".bin", "prisma");

module.exports = async function () {
  process.env.DATABASE_URL = "postgresql://fl:fl@db:5432/fl?schema=test";
  await prismaClient.$executeRawUnsafe(`DROP SCHEMA IF EXISTS test CASCADE;`);

  execSync(`${prismaBinary} db push`, {
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL,
    },
  });
};
