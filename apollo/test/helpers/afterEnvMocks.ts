jest.mock("ioredis", () => jest.requireActual("ioredis-mock"));
jest.mock("../../src/internal/prismaClient", () => jestPrisma.client);
