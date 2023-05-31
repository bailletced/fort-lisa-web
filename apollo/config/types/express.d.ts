import { ContextUser } from "../../src/context";

declare module "express-session" {
  interface SessionData {
    user: ContextUser;
  }
}

export {};
