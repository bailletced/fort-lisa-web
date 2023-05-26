import "reflect-metadata";
import { GraphQLSchema, lexicographicSortSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { printSchemaWithDirectives } from "@graphql-tools/utils";
import { outputFile } from "type-graphql/dist/helpers/filesystem";
import { permissionDirective } from "./graphql/directives/permissionDirective";
export async function getSchema(): Promise<GraphQLSchema> {
  return await buildSchema({
    resolvers: [process.cwd() + "/src/graphql/resolvers/**/*.ts"],
    directives: [permissionDirective],
  });
}

export async function emitSchemaDefinitionWithDirectivesFile(
  schemaFilePath: string,
  schema: GraphQLSchema
): Promise<void> {
  const schemaFileContent = printSchemaWithDirectives(
    lexicographicSortSchema(schema)
  );
  await outputFile(schemaFilePath, schemaFileContent);
}
