import session from "express-session";
import { redisClient } from "../internal/redisClient";
import { whitelistOperationMiddleware } from "./whitelistOperationsMiddleware";

const express = require("express");

export const middlewares = async () => {
  const RedisStore = require("connect-redis")(session);

  return [
    express.json(),
    express.urlencoded({ extended: false }),
    session({
      name: "tblfrt_session",
      store: new RedisStore({ client: redisClient }),
      secret: process.env.EXPRESS_SECRET_COOKIE as string,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        sameSite: false,
        secure: process.env.ENV === "production",
      },
      resave: false,
      rolling: false,
    }),
    whitelistOperationMiddleware,
  ];
};
