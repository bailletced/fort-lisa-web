import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://backend:4000/graphql/",
  documents: ["graphql/**/*.graphql"],
  generates: {
    "./graphql/types.ts": {
      plugins: ["typescript"],
    },
  },
};
export default config;
