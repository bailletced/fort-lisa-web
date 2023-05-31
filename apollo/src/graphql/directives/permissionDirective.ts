import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import {
  DirectiveLocation,
  GraphQLDirective,
  GraphQLString,
  defaultFieldResolver,
} from "graphql";
import { DIRECTIVES } from ".";
import { Context } from "../../context";
import { UnauthenticatedException } from "../../exceptions/UnauthenticatedException";
import { RoleMissingException } from "../../exceptions/RoleMissingException";
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
        const { perm, onFailure } = permissionDirective;

        // Replace the original resolver with a function that *first* checks for required roles
        // then return the result
        fieldConfig.resolve = async function (
          source,
          args,
          context: Context,
          info
        ) {
          if (!context.user) {
            throw new UnauthenticatedException();
          }

          if (!context.user.roles?.includes(perm)) {
            if (onFailure === "throw") {
              throw new RoleMissingException();
            }
            return null;
          }

          return await resolve(source, args, context, info);
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
    onFailure: {
      description:
        "What the directive should return in case of missing permission",
      defaultValue: "throw",
      type: GraphQLString,
    },
  },
  locations: [
    DirectiveLocation.MUTATION,
    DirectiveLocation.QUERY,
    DirectiveLocation.FIELD,
  ],
});
