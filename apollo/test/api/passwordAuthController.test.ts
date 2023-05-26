import { faker } from "@faker-js/faker";
import prismaClient from "../../src/internal/prismaClient";
import { createTestApp } from "../helpers/setupApp";
import request from "supertest";
import crypto from "crypto";

describe("OperationStore controller", () => {
  it("should fail to login if user does not exist", async () => {
    const app = await createTestApp();

    const response = await request(app)
      .post("/api/auth/password/login")
      .send({
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .set("Accept", "application/json");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("authentication.failed");
  });

  it("should login user if exist", async () => {
    const app = await createTestApp();

    const email = faker.internet.email();
    const password = "toto";
    const salt = crypto.randomBytes(16).toString(`hex`);
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
      .toString(`hex`);

    await prismaClient.user.create({
      data: {
        email,
        hashedPassword,
        salt,
      },
    });

    const response = await request(app)
      .post("/api/auth/password/login")
      .send({
        email,
        password,
      })
      .set("Accept", "application/json");
    const sessionCount = await prismaClient.userSessionSubscription.count();

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(sessionCount).toBe(1);

    // Login again should not create another session subscription
    const response2 = await request(app)
      .post("/api/auth/password/login")
      .send({
        email,
        password,
      })
      .set("Accept", "application/json");
    const sessionCount2 = await prismaClient.userSessionSubscription.count();

    expect(response2.statusCode).toBe(200);
    expect(response2.body.success).toBe(true);
    expect(sessionCount2).toBe(1);
  });
});
