import { Request, Response } from "express";
import prismaClient from "../internal/prismaClient";
import { redisClient } from "../internal/redisClient";

export const operations_store = async (req: Request, res: Response) => {
  const operationsHeader = req.headers["fl-gql-operations"];
  if (operationsHeader !== process.env.FL_GQL_OPERATIONS) {
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
