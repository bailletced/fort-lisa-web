import { Prisma, PrismaClient } from "@prisma/client";

export type TPrismaClient = PrismaClient<
  Prisma.PrismaClientOptions,
  never,
  Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
>;
