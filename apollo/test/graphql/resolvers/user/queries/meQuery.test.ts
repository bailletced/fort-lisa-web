import { faker } from "@faker-js/faker";
import { gql } from "graphql-request";
import prismaClient from "../../../../../src/internal/prismaClient";
import { executeGqlSchema } from "../../../../helpers/executeGraphql";

describe("Me query", () => {
  const query = gql`
    query getMe {
      me {
        userId
        email
        name
      }
    }
  `;

  it("should return user logged-in user data", async () => {
    const user = await prismaClient.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.internet.userName(),
      },
    });
    await prismaClient.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.internet.userName(),
      },
    });

    const response = await executeGqlSchema(query, user);
    expect(response.body["singleResult"].data.me).toEqual({
      userId: user.userId,
      email: user.email,
      name: user.name,
    });
  });

  it("should return null if non-logged user try to get informations", async () => {
    const response = await executeGqlSchema(query, null);
    expect(response.body["singleResult"].data.me).toBeNull();
  });
});
