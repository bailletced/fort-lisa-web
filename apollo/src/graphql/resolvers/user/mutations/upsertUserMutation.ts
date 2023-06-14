import {
  Args,
  ArgsType,
  Ctx,
  Directive,
  Field,
  Mutation,
  Resolver,
} from "type-graphql";
import { UserType } from "../../../types/user/UserType";
import { Context } from "../../../../context";
import { DIRECTIVES } from "../../../directives";
import { ROLE } from "../../../enums/roleEnum";
import { User } from "@prisma/client";

@ArgsType()
export class UserInput {
  @Field((type) => String)
  email: string;

  @Field((type) => String)
  name: string;

  @Field((type) => String, { nullable: true })
  permissionSetId?: string;

  @Field((type) => String, { nullable: true })
  salt?: string;

  @Field((type) => String, { nullable: true })
  password?: string;
}

@Resolver()
export class UpsertUserMutation {
  @Directive(
    `@${DIRECTIVES.HAS_PERM}(perm: "${ROLE.WRITE_USERS}", onFailure: "throw")`
  )
  @Mutation(() => UserType, { nullable: true })
  async upsertUser(
    @Args((type) => UserInput) userData: UserInput,
    @Ctx() ctx: Context
  ): Promise<User> {
    try {
      return await ctx.models.userModel.createUser(userData);
    } catch (error) {
      console.log(error);
    }
  }
}
