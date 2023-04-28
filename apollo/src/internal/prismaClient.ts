import { PrismaClient } from "@prisma/client";

let prismaClient: PrismaClient;

if (process.env.ENV === "production") {
  prismaClient = new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
    log: ["query", "info"],
  });
} else {
  let globalWithPrisma = global as typeof globalThis & {
    prismaClient: PrismaClient;
  };
  if (!globalWithPrisma.prismaClient) {
    globalWithPrisma.prismaClient = new PrismaClient({
      datasources: { db: { url: process.env.DATABASE_URL } },
      log: ["query"],
    });
  }
  prismaClient = globalWithPrisma.prismaClient;
}

export default prismaClient;
