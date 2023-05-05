import { faker } from "@faker-js/faker";
import prismaClient from "../../src/internal/prismaClient";
import { redisClient } from "../../src/internal/redisClient";
import request from "supertest";
import express from "express";
import router from "../../config/routes";

const operations = {
  "3fb2288d5ec4201c04dfaeadad3dbc7ed1cce3f2039812af365daae22ec47d48":
    "query {getMe...}",
  "4cddb9c7c19be71e5e0580d03481bfd74ea4413d46ba3aefd15aa82f0ca4bf2b":
    "query {getMeAgain...}",
};

describe("OperationStore controller", () => {
  const app = express();
  app.use(express.json());
  app.use(router);

  it("should fail if secret header is not provided", async () => {
    const initialCount = await prismaClient.operationStore.count();
    const response = await request(app)
      .post("/operations")
      .send(operations)
      .set("Accept", "application/json");

    expect(initialCount).toEqual(0);
    expect(response.status).toEqual(403);
  });

  it("should import operations to redis and database", async () => {
    const originOperations = await redisClient.hgetall("operations");
    expect(originOperations).toEqual({});

    const response = await request(app)
      .post("/operations")
      .set({
        [process.env.FL_GQL_OPERATION_HEADER]:
          process.env.FL_GQL_OPERATION_SECRET,
      })
      .send(operations)
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);

    const storedOperations = await prismaClient.operationStore.findMany();
    const storedRedisOperations = await redisClient.hgetall("operations");

    expect(storedOperations.length).toEqual(Object.keys(operations).length);
    Object.keys(operations).map((ope) => {
      expect(storedOperations.map((ope) => ope.operationId).includes(ope));
    });

    expect(Object.keys(storedRedisOperations).length).toEqual(
      Object.keys(operations).length
    );
    Object.keys(operations).map((ope) => {
      expect(
        Object.keys(storedRedisOperations)
          .map((opeId) => opeId)
          .includes(ope)
      );
    });
  });
});
