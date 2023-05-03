import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://backend:4000/graphql/",
  documents: ["graphql/**/*.graphql"],
  generates: {
    "./graphql/types.ts": {
      plugins: ["typescript"],
    },
    "./graphql/client.json": {
      plugins: ["graphql-codegen-persisted-query-ids"],
      config: {
        output: "client",
        algorithm: "sha256",
      },
    },
    "./graphql/server.json": {
      plugins: ["graphql-codegen-persisted-query-ids"],
      config: {
        output: "server",
        algorithm: "sha256",
      },
    },
  },
};
export default config;
