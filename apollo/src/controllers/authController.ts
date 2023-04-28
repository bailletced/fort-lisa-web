import { prisma, User } from "@prisma/client";
import dayjs from "dayjs";
import { Request, Response } from "express";
import { FieldMissingException } from "../exception/FieldMissingException";
import { UserAlreadyExistException } from "../exception/UserAlreadyExistException";
import { UserNotFoundException } from "../exception/UserNotFoundException";
import prismaClient from "../internal/prismaClient";
import { isDefined, isNotDefined } from "../internal/object";
import { verifyToken } from "./auth/verifyToken";
import { CognitoUserPool } from "amazon-cognito-identity-js";
export type TJwtBody = {
  email: string;
  email_verified: boolean;
};

export const auth_sign_in_password = async (req: Request, res: Response) => {
  const jwt = req.body.jwt;
  const decodedJwt = await verifyToken(jwt);
  if (decodedJwt instanceof Error) {
    return res.status(400).send({
      error: decodedJwt,
    });
  } else {
    const validDecodedJwt = decodedJwt as TJwtBody;
    const email = validDecodedJwt?.email;

    try {
      // Fetch user
      let user = await prismaClient.user.findUniqueOrThrow({
        where: {
          email,
        },
      });
      user = await signInUserPassword(req, user);
      return res.json(user);
    } catch (err) {
      const error = new UserNotFoundException(email);
      return res.status(error.status).json(error.response);
    }
  }
};

export const auth_sign_up_password = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  if (isNotDefined(email) || isNotDefined(password)) {
    const error = new FieldMissingException("email or password");
    return res.status(error.status).json(error.response);
  }

  const poolData = {
    UserPoolId: process.env.AWS_COGNITO_POOL_ID,
    ClientId: process.env.AWS_COGNITO_CLIENT_ID,
  };
  const userPool = new CognitoUserPool(poolData);

  await userPool.signUp(email, password, [], [], async (err) => {
    if (err) {
      if (err.name === "UsernameExistsException") {
        const user = await prismaClient.user.findFirst({
          where: {
            email,
          },
        });
        if (isDefined(user)) {
          if (user?.isActive) {
            const error = new UserAlreadyExistException(email);
            return res.status(error.status).json(error.response);
          }
          return res.status(200).json({ status: "confirmation_required" });
        }
      }
      return res.status(400).json(err);
    }

    try {
      const user = await prismaClient.user.create({
        data: {
          email,
        },
      });
      return res.status(200).json(user);
    } catch (err) {
      const error = new UserAlreadyExistException(email);
      return res.status(error.status).json(error.response);
    }
  });
};

export const signInUserPassword = async (
  req: Request,
  user: User
): Promise<User> => {
  // create a session for the user if exists
  req.session.user = user;

  user = await prismaClient.user.update({
    where: {
      userId: user.userId,
    },
    data: {
      lastConnection: dayjs().toISOString(),
      isActive: true,
    },
  });

  return { ...user };
};
