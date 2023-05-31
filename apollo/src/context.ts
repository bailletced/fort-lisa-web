import { User } from "@prisma/client";
import { Request } from "express";
import { getUserRoles } from "./models/userModel";
import { ROLE } from "./graphql/enums/roleEnum";

export type Context = {
  req: Request;
  user?: ContextUser;
};

export type ContextUser = Omit<User, "permissionSetId"> & {
  roles?: ROLE[];
};

export async function getContextUser(user: User): Promise<ContextUser> {
  const userRoles = await getUserRoles(user);
  return { ...user, roles: userRoles.map((role) => role.name as ROLE) };
}

export const getContext = (req: Request): Context => {
  const user = req.session?.user as ContextUser;
  return {
    req,
    user,
  };
};
