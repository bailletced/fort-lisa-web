import { User } from "@prisma/client";
import { Request } from "express";

export interface Context {
  req: Request;
  user?: User;
}

export const getContext = (req: Request): Context => {
  const user = req.session?.user as User;

  return {
    req,
    user,
  };
};
