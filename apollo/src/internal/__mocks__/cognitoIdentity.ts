import { redisClient } from "../redisClient";

type TCognitoUser = {
  email: string;
  password: string;
};

export class CognitoUserPool {
  initialize = async (users: TCognitoUser[]) => {
    users.map(async (user) => {
      await redisClient.set(user.email, user.email);
    });
  };
  signUp = async (
    email: string,
    password: string,
    userAttribute: any,
    validationData: any,
    callback: any
  ) => {
    const alreadyExistingUser = await redisClient.get(email);

    if (alreadyExistingUser) {
      const err = new Error("An account with the given email already exists.");
      err.name = "UsernameExistsException";
      await callback(err);
      return;
    }

    await redisClient.set(email, email);
    await callback();

    return { email, password };
  };
}
