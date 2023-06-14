import { faker } from "@faker-js/faker";
import { gql } from "graphql-request";
import prismaClient from "../../../../../src/internal/prismaClient";
import { executeGqlSchema } from "../../../../helpers/executeGraphql";
import { createUser } from "../../../../../src/helpers/fixtures/FortLisaDataset";
import { ROLE } from "../../../../../src/graphql/enums/roleEnum";
import { getContextUser } from "../../../../../src/context";

describe("Me query", () => {
  const query = gql`
    query getMe {
      me {
        userId
        email
        name
        permissionSet {
          roles
        }
      }
    }
  `;

  it("should return user logged-in user data", async () => {
    const user = await createUser({ email: "aa@aa.com" }, [
      ROLE.READ_USERS,
      ROLE.WRITE_USERS,
    ]);

    await prismaClient.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.internet.userName(),
      },
    });

    const response = await executeGqlSchema(query, await getContextUser(user));
    expect(response.body["singleResult"].data.me).toEqual({
      userId: user.userId,
      email: user.email,
      name: user.name,
      permissionSet: {
        roles: [ROLE.READ_USERS, ROLE.WRITE_USERS],
      },
    });
  });

  it("should return null if non-logged user try to get informations", async () => {
    const response = await executeGqlSchema(query, null);
    expect(response.body["singleResult"].data.me).toBeNull();
  });
});
