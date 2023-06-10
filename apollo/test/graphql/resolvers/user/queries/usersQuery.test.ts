import { faker } from "@faker-js/faker";
import { gql } from "graphql-request";
import prismaClient from "../../../../../src/internal/prismaClient";
import { executeGqlSchema } from "../../../../helpers/executeGraphql";
import { ROLE } from "../../../../../src/graphql/enums/roleEnum";
import { getContextUser } from "../../../../../src/context";

describe("users query", () => {
  const query = gql`
    query getUsers($after: String, $first: Float) {
      users(after: $after, first: $first) {
        totalCount
        edges {
          cursor
          node {
            email
          }
        }
        pageInfo {
          endCursor
          hasNextPage
          hasPreviousPage
          startCursor
        }
      }
    }
  `;

  it("should fail if user is not authenticated", async () => {
    await prismaClient.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.internet.userName(),
      },
    });

    const response = await executeGqlSchema(query, null, {
      after: null,
      first: 5,
    });
    expect(response.body["singleResult"].data.users).toBeNull();
  });

  it("should return paginated data", async () => {
    const role = await prismaClient.role.create({
      data: {
        name: ROLE.READ_USERS,
      },
    });
    const permSet = await prismaClient.permissionSet.create({
      data: {
        name: "perm",
      },
    });
    await prismaClient.permissionSetRoleSubscription.create({
      data: {
        permissionSetId: permSet.permissionSetId,
        roleId: role.roleId,
      },
    });

    const user = await getContextUser(
      await prismaClient.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.internet.userName(),
          permissionSetId: permSet.permissionSetId,
        },
      })
    );

    const response = await executeGqlSchema(query, user, {
      after: null,
      first: 5,
    });

    expect(response.body["singleResult"].data.users).toEqual({
      totalCount: 1,
      edges: [
        {
          cursor: user.userId,
          node: {
            email: user.email,
          },
        },
      ],
      pageInfo: {
        startCursor: user.userId,
        endCursor: user.userId,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });
});
