import "reflect-metadata";
import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export async function getSchema(): Promise<GraphQLSchema> {
  return await buildSchema({
    resolvers: [__dirname + "/graphql/resolvers/**/*.ts"],
    emitSchemaFile: true,
  });
}
