import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import {
  DirectiveLocation,
  GraphQLDirective,
  GraphQLString,
  defaultFieldResolver,
} from "graphql";
import { DIRECTIVES } from ".";
import { Context } from "../../context";
export function permissionDirectiveTransformer(schema, directiveName) {
  return mapSchema(schema, {
    // Executes once for each object field in the schema
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      // Check whether this field has the specified directive
      const permissionDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];

      if (permissionDirective) {
        // Get this field's original resolver
        const { resolve = defaultFieldResolver } = fieldConfig;
        const { perm } = permissionDirective;

        // Replace the original resolver with a function that *first* calls
        // the original resolver, then converts its result to upper case
        fieldConfig.resolve = async function (
          source,
          args,
          context: Context,
          info
        ) {
          if (!context.user) {
            throw new Error(`NOT AUTH ${perm}`);
          }

          const result = await resolve(source, args, context, info);
          if (typeof result === "string") {
            return result.toUpperCase();
          }
          return result;
        };
        return fieldConfig;
      }
    },
  });
}

export const permissionDirective = new GraphQLDirective({
  name: DIRECTIVES.HAS_PERM,
  args: {
    perm: {
      description: "An array of required permissions",
      defaultValue: null,
      type: GraphQLString,
    },
  },
  locations: [
    DirectiveLocation.MUTATION,
    DirectiveLocation.QUERY,
    DirectiveLocation.FIELD,
  ],
});
