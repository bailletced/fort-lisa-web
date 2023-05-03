import session from "express-session";
import { redisClient } from "../internal/redisClient";
import { whitelistOperationMiddleware } from "./whitelistOperationsMiddleware";
import RedisStore from "connect-redis";
export const middlewares = async () => {
  return [
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
