import { Request, Response, NextFunction } from "express";
import { WhitelistHashNotFoundException } from "../exceptions/WhitelistHashNotFoundException";
import { isDefined, isNotDefined } from "../internal/object";
import prismaClient from "../internal/prismaClient";
import { redisClient } from "../internal/redisClient";

export const whitelistOperationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let queryHash;
  if (req.method === "POST") {
    queryHash = req.body.operationId;
  } else {
    queryHash = req.query.operationId;
  }

  if (isDefined(queryHash)) {
    let queryString = await redisClient.hget("operations", queryHash);

    if (isNotDefined(queryString)) {
      const operationStore = await prismaClient.operationStore.findUnique({
        where: {
          operationId: queryHash,
        },
        select: {
          query: true,
        },
      });

      if (isNotDefined(operationStore)) {
        const error = new WhitelistHashNotFoundException(queryHash);
        return res.status(error.status).json(error.response);
      } else {
        queryString = operationStore?.query as string;
        await redisClient.hset("operations", queryHash, queryString);
      }
    }

    if (req.method === "POST") {
      req.body.query = queryString;
    } else {
      req.query.query = queryString ?? "";
    }
  } else if (process.env.NODE_ENV === "production") {
    return res.status(400).send({
      message: `It is not possible to perform plain queries. Please, provide a hash.`,
    });
  }

  next();
};
