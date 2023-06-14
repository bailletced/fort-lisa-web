import { faker } from "@faker-js/faker";
import { gql } from "graphql-request";
import { createUser } from "../../../../../src/helpers/fixtures/FortLisaDataset";
import prismaClient from "../../../../../src/internal/prismaClient";
import { executeGqlSchema } from "../../../../helpers/executeGraphql";
import { ROLE } from "../../../../../src/graphql/enums/roleEnum";
import { getContextUser } from "../../../../../src/context";

describe("upsert user query", () => {
  const mutation = gql`
    mutation upsertUser($email: String!, $name: String!) {
      upsertUser(email: $email, name: $name) {
        email
        name
      }
    }
  `;

  it("should fail if user is not authenticated", async () => {
    const response = await executeGqlSchema(mutation, null, {
      email: "zeogkjzoegk@zoekgok.com",
      name: "ergzehzeh",
    });
    expect(response.body["singleResult"].data.upsertUser).toBeNull();
  });

  it("should fail if user hasn't role", async () => {
    const user = await createUser(null);

    const response = await executeGqlSchema(mutation, user, {
      email: "zeogkjzoegk@zoekgok.com",
      name: "ergzehzeh",
    });

    expect(response.body["singleResult"].data.upsertUser).toBeNull();
    expect(response.body["singleResult"].errors[0].message).toEqual(
      "role.missing"
    );
  });

  it("should create a new user", async () => {
    const user = await createUser(null, [ROLE.WRITE_USERS]);
    const userInput = {
      email: "toto@toto.com",
      name: "toto",
    };
    expect(await prismaClient.user.count()).toEqual(1);

    const response = await executeGqlSchema(
      mutation,
      await getContextUser(user),
      userInput
    );
    expect(response.body["singleResult"].data.upsertUser).toEqual(userInput);
    expect(await prismaClient.user.count()).toEqual(2);
  });

  it("should create update new user", async () => {
    const user = await createUser(null, [ROLE.WRITE_USERS]);
    const user2 = await createUser({ email: "toto@toto.com" });

    const userInput = {
      email: "toto@toto.com",
      name: "tata",
    };
    const originPwd = user2.hashedPassword;
    expect(await prismaClient.user.count()).toEqual(2);

    const response = await executeGqlSchema(
      mutation,
      await getContextUser(user),
      userInput
    );
    expect(response.body["singleResult"].data.upsertUser).toEqual(userInput);
    expect(await prismaClient.user.count()).toEqual(2);
    expect(originPwd).toEqual(
      (await prismaClient.user.findFirst({ where: { email: "toto@toto.com" } }))
        .hashedPassword
    );
  });
});
