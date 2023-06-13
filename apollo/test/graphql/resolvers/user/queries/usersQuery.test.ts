import { faker } from "@faker-js/faker";
import { gql } from "graphql-request";
import prismaClient from "../../../../../src/internal/prismaClient";
import { executeGqlSchema } from "../../../../helpers/executeGraphql";
import { ROLE } from "../../../../../src/graphql/enums/roleEnum";
import { getContextUser } from "../../../../../src/context";
import { createUser } from "../../../../../src/helpers/fixtures/FortLisaDataset";

describe("users query", () => {
  const query = gql`
    query getUsers($after: String, $first: Float) {
      users(after: $after, first: $first) {
        totalCount
        edges {
          cursor
          node {
            email
            permissionSet {
              roles
            }
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

  it("should fail if user hasn't role", async () => {
    const user = await createUser(null);

    const response = await executeGqlSchema(query, user, {
      after: null,
      first: 5,
    });

    expect(response.body["singleResult"].data.users).toBeNull();
    expect(response.body["singleResult"].errors[0].message).toEqual(
      "role.missing"
    );
  });

  it("should return paginated data", async () => {
    const user = await createUser("aa@aa.com", [ROLE.READ_USERS]);
    const user2 = await createUser("bb@bb.com", [ROLE.WRITE_USERS]);

    const response = await executeGqlSchema(query, await getContextUser(user), {
      after: null,
      first: 5,
    });

    expect(response.body["singleResult"].data.users).toEqual({
      totalCount: 2,
      edges: [
        {
          cursor: user.userId,
          node: {
            email: user.email,
            permissionSet: {
              roles: [ROLE.READ_USERS],
            },
          },
        },
        {
          cursor: user2.userId,
          node: {
            email: user2.email,
            permissionSet: {
              roles: [ROLE.WRITE_USERS],
            },
          },
        },
      ],
      pageInfo: {
        startCursor: user.userId,
        endCursor: user2.userId,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  });
});
