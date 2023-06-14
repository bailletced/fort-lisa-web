import session from "express-session";
import genFunc from "connect-pg-simple";
import pg from "pg";
import { COOKIES } from "../../constants/cookies";
import passport from "../internal/passport";

const pgSession = genFunc(session);
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
export const middlewares = async () => {
  return [
    session({
      name: COOKIES.SESSION,
      store: new pgSession({
        pool: pgPool,
        tableName: "sessions",
        conString: process.env.DATABASE_URL,
        pruneSessionInterval: 2592000, //30 days in seconds,
      }),
      secret: process.env.EXPRESS_SECRET_COOKIE,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
        sameSite: "none",
        secure: false,
      },
      resave: true,
      rolling: false,
    }),
    passport.initialize(),
    passport.session(),
    // whitelistOperationMiddleware,
  ];
};
