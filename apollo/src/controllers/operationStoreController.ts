import { Request, Response } from "express";
import { redisClient } from "../internal/redisClient";
import prismaClient from "../internal/prismaClient";
import { faker } from "@faker-js/faker";

export const operations_store = async (req: Request, res: Response) => {
  const operationsHeader = req.headers[process.env.FL_GQL_OPERATION_HEADER];
  if (operationsHeader !== process.env.FL_GQL_OPERATION_SECRET) {
    return res.status(403).send({
      message: "You are not authorized to perform queries on this endpoint.",
    });
  }
  const operations = req.body;

  try {
    await Promise.all(
      Object.keys(operations).map(async (operationId) => {
        await prismaClient.operationStore.upsert({
          where: {
            operationId: operationId,
          },
          update: {
            query: operations[operationId],
          },
          create: {
            operationId: operationId,
            query: operations[operationId],
          },
        });
        await redisClient.hset(
          "operations",
          operationId,
          operations[operationId]
        );
      })
    );

    return res.status(200).send({
      success: "Graphql successfully synced!",
    });
  } catch (error) {
    return res.status(400).send({
      error,
    });
  }
};
