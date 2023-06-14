import { User } from "@prisma/client";
import { Request } from "express";
import { ROLE } from "./graphql/enums/roleEnum";
import { RoleLoader } from "./helpers/loaders/roleLoader";
import { PermissionSetLoader } from "./helpers/loaders/permissionSetLoader";
import prismaClient from "./internal/prismaClient";
import { UserModel } from "./models/userModel";

export type Context = {
  req: Request;
  user?: ContextUser;
  dataSources: TContextDataSources;
  models: TContextModels;
};

export type ContextUser = Omit<User, "permissionSetId"> & {
  permissionSet?: {
    permissionSetId: string;
    name: string;
    roles: ROLE[];
  };
};

type TContextDataSources = {
  roleLoader: RoleLoader;
  permissionSetLoader: PermissionSetLoader;
};

type TContextModels = {
  userModel: UserModel;
};

export const contextDataSources: TContextDataSources = {
  roleLoader: new RoleLoader(),
  permissionSetLoader: new PermissionSetLoader(),
};

export const contextModels: TContextModels = {
  userModel: new UserModel(),
};

export async function getContextUser(user: User): Promise<ContextUser> {
  const userRoles = await new UserModel().getUserRoles(user);
  const permissionSet = await prismaClient.permissionSet.findFirst({
    where: {
      permissionSetId: user.permissionSetId || undefined,
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
    models: contextModels,
  };
};
