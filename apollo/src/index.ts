import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { emitSchemaDefinitionWithDirectivesFile, getSchema } from "./schema";
import router from "../config/routes";
import { middlewares } from "./middlewares";
import { Context, getContext } from "./context";
import { permissionDirectiveTransformer } from "./graphql/directives/permissionDirective";
import { DIRECTIVES } from "./graphql/directives";

// integration with Express
export const app = express();

// Middlewares initialization
await (await middlewares()).map((middleware) => app.use(middleware));

app.use("/api", router);

const httpServer = http.createServer(app);
let graphqlSchema = await getSchema();
await emitSchemaDefinitionWithDirectivesFile("./schema.gql", graphqlSchema);

// Apply directives to schema
graphqlSchema = permissionDirectiveTransformer(
  graphqlSchema,
  DIRECTIVES.HAS_PERM
);

const server = new ApolloServer<Context>({
  schema: graphqlSchema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  status400ForVariableCoercionErrors: true,
});

await server.start();
app.use(
  "/graphql",
  cors<cors.CorsRequest>({
    origin: ["https://studio.apollographql.com", "https://dev.fort-lisa.com"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => getContext(req),
  })
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve)
);
console.log(`🚀 Server ready at https://dev.fort-lisa.com/graphql`);
