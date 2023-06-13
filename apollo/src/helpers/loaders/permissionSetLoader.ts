import DataLoader from "dataloader";
import prismaClient from "../../internal/prismaClient";

export class PermissionSetLoader {
  private batchPermSets = new DataLoader(async (ids: string[]) => {
    const permSets = await prismaClient.permissionSet.findMany({
      where: {
        permissionSetId: { in: ids },
      },
    });

    // Dataloader expects you to return a list with the results ordered just like the list in the arguments were
    // Since the database might return the results in a different order the following code sorts the results accordingly
    const permSetIdToPermsMap = permSets.reduce((mapping, permSet) => {
      mapping[permSet.permissionSetId] = permSet;
      return mapping;
    }, {});

    return ids.map((id) => permSetIdToPermsMap[id]);
  });

  async getPermSet(id: string) {
    return this.batchPermSets.load(id);
  }

  async getPermSets(ids: string[]) {
    return this.batchPermSets.loadMany(ids);
  }
}
