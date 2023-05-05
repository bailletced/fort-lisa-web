import { User } from "@prisma/client";
import { ApolloServer } from "@apollo/server";
import { getSchema } from "../../src/schema";
import { Context } from "../../src/context";

export const executeGqlSchema = async (
  query: string,
  user: User | null,
  variables?: any
) => {
  const apolloServer = new ApolloServer<Context>({
    schema: await getSchema(),
  });

  return (await apolloServer).executeOperation(
    { query, variables },
    {
      contextValue: {
        req: null,
        user,
      },
    }
  );
};
