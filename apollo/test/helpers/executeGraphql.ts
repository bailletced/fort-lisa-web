import { ApolloServer } from "@apollo/server";
import { getSchema } from "../../src/schema";
import {
  Context,
  ContextUser,
  contextDataSources,
  contextModels,
} from "../../src/context";
import { permissionDirectiveTransformer } from "../../src/graphql/directives/permissionDirective";
import { DIRECTIVES } from "../../src/graphql/directives";

export const executeGqlSchema = async (
  operation: string,
  user?: ContextUser,
  variables?: any
) => {
  // Apply directives to schema
  const schema = permissionDirectiveTransformer(
    await getSchema(),
    DIRECTIVES.HAS_PERM
  );

  const apolloServer = new ApolloServer<Context>({
    schema,
  });

  return (await apolloServer).executeOperation(
    { query: operation, variables },
    {
      contextValue: {
        req: null,
        user: user,
        dataSources: contextDataSources,
        models: contextModels,
      },
    }
  );
};
