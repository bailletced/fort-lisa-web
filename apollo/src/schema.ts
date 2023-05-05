import "reflect-metadata";
import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
export async function getSchema(): Promise<GraphQLSchema> {
  return await buildSchema({
    resolvers: [process.cwd() + "/src/graphql/resolvers/**/*.ts"],
    emitSchemaFile: true,
  });
}
