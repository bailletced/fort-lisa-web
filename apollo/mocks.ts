jest.mock("./src/internal/prismaClient");
jest.mock("ioredis", () => jest.requireActual("ioredis-mock"));
jest.mock("amazon-cognito-identity-js", () =>
  jest.requireActual("./src/internal/__mocks__/cognitoIdentity.ts")
);
