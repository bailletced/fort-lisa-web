import { User } from "@prisma/client";
import { Request } from "express";
import { getUserRoles } from "./models/userModel";
import { ROLE } from "./graphql/enums/roleEnum";
import { RoleLoader } from "./helpers/loaders/roleLoader";
import { PermissionSetLoader } from "./helpers/loaders/permissionSetLoader";
import prismaClient from "./internal/prismaClient";

export type Context = {
  req: Request;
  user?: ContextUser;
  dataSources: TContextDataSource;
};

export type ContextUser = Omit<User, "permissionSetId"> & {
  permissionSet?: {
    permissionSetId: string;
    name: string;
    roles: ROLE[];
  };
};

type TContextDataSource = {
  roleLoader: RoleLoader;
  permissionSetLoader: PermissionSetLoader;
};

export const contextDataSources = {
  roleLoader: new RoleLoader(),
  permissionSetLoader: new PermissionSetLoader(),
};

export async function getContextUser(user: User): Promise<ContextUser> {
  const userRoles = await getUserRoles(user);
  const permissionSet = await prismaClient.permissionSet.findFirst({
    where: {
      permissionSetId: user.permissionSetId,
    },
  });
  return {
    ...user,
    permissionSet: {
      permissionSetId: permissionSet?.permissionSetId,
      name: permissionSet?.name,
      roles: userRoles.map((role) => role.name as ROLE),
    },
  };
}

export const getContext = (req: Request): Context => {
  const user = req.session?.user as ContextUser;
  return {
    req,
    user,
    dataSources: contextDataSources,
  };
};
