import { ContextUser } from "../src/context";

export const thisIsAModule = true;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HOME: string;
      API_ENDPOINT: string;
      DATABASE_URL: string;
      REDIS_HOST: string;
      FL_GQL_OPERATION_HEADER: string;
      FL_GQL_OPERATION_SECRET: string;
      EXPRESS_SECRET_COOKIE: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_SECRET: string;
      ENV: string;
    }
  }

  namespace Express {
    interface User extends ContextUser {}
  }
}
