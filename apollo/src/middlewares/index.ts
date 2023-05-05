import session from "express-session";
import { whitelistOperationMiddleware } from "./whitelistOperationsMiddleware";
import passport from "passport";
import genFunc from "connect-pg-simple";

const PostgresqlStore = genFunc(session);
const sessionStore = new PostgresqlStore({
  conString: process.env.DATABASE_URL,
  tableName: 'sessions',
  col
});

export const middlewares = async () => {
  return [
    session({
      name: "fl-session",
      store: sessionStore,
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
    passport.authenticate("session"),
    whitelistOperationMiddleware,
  ];
};
