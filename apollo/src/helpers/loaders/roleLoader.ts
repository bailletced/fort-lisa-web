import DataLoader from "dataloader";
import prismaClient from "../../internal/prismaClient";

export class RoleLoader {
  private roleFromSubscriptions = new DataLoader(async (ids: string[]) => {
    const roles = await prismaClient.role.findMany({
      where: {
        permissionSetRoleSubscriptions: {
          some: {
            permissionSetRoleSubscriptionId: {
              in: ids,
            },
          },
        },
      },
      select: {
        name: true,
      },
    });

    const roleIdToRoleMap = [];
    ids.forEach((id, index) => {
      roleIdToRoleMap[id] = roles[index];
    });

    return ids.map((id) => roleIdToRoleMap[id]);
  });

  private roleFromPermissionSets = new DataLoader(async (ids: string[]) => {
    const inString = ids.reduce((acc, id) => `'${acc}', '${id}',`).slice(0, -1); //Prisma.join not working in test env
    const roles: { name: string; permissionSetId: string }[] =
      await prismaClient.$queryRawUnsafe(`
        SELECT r.name, ps.permission_set_id as "permissionSetId" FROM roles r, permission_sets ps, permission_set_role_subscriptions psrs
        WHERE r.role_id = psrs.role_id AND ps.permission_set_id = psrs.permission_set_id
        AND ps.permission_set_id IN (${inString})
      `);

    const permSetIdToRolesMap = roles.reduce((mapping, role) => {
      mapping[role.permissionSetId] = [
        ...(mapping[role.permissionSetId] || []),
        role.name,
      ];
      return mapping;
    }, {});

    return ids.map((id) => {
      return permSetIdToRolesMap[id];
    });
  });

  async getRolesFromSubscription(id: string) {
    return this.roleFromSubscriptions.load(id);
  }

  async getRolesFromSubscriptions(ids: string[]) {
    return this.roleFromSubscriptions.loadMany(ids);
  }

  async getRolesFromPermissionSet(id: string) {
    return this.roleFromPermissionSets.loadMany([id]);
  }
}
