import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { getSchema } from "./schema";
import router from "../config/routes";
import { middlewares } from "./middlewares";

interface MyContext {
  token?: String;
}

// integration with Express
const app = express();

// Middlewares initialization
await (await middlewares()).map((middleware) => app.use(middleware));

app.use("/api", router);

const httpServer = http.createServer(app);
let graphqlSchema = await getSchema();

const server = new ApolloServer<MyContext>({
  schema: graphqlSchema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();
app.use(
  "/graphql",
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve)
);
console.log(`🚀 Server ready at https://dev.fort-lisa.com/graphql`);
