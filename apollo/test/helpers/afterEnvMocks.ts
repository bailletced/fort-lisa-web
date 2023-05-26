jest.mock("ioredis", () => jest.requireActual("ioredis-mock"));
jest.mock("../../src/internal/prismaClient", () => jestPrisma.client);
// process.env.EXPRESS_SECRET_COOKIE = "s%3A432.D5egYRj1G7sJyfbyB7jDh7Gf";

global.setImmediate = jest.useRealTimers as unknown as typeof setImmediate;
