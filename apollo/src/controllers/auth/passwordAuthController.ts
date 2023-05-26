import crypto from "crypto";
import { Request, Response } from "express";
import prismaClient from "../../internal/prismaClient";
import passport from "passport";
import { User } from "@prisma/client";

export const auth_password_register = async (req: Request, res: Response) => {
  const salt = crypto.randomBytes(16).toString(`hex`);
  const hashedPassword = crypto
    .pbkdf2Sync(req.body.password, salt, 1000, 64, `sha512`)
    .toString(`hex`);

  try {
    const user = await prismaClient.user.create({
      data: {
        email: req.body.email,
        hashedPassword,
        salt,
      },
    });

    req.login(user, function (err) {
      if (err) {
        return res.status(400).send(err.message);
      }
      return res.status(200).send(user);
    });
  } catch (err) {
    return res.status(400).send("TODO : error ");
  }
};

export const auth_password_login = async (req, res, next) => {
  passport.authenticate("local", async (err, user: User) => {
    if (err) {
      return res.status(500).send({ message: "server.error" });
    }
    if (!user) {
      return res.status(401).send({ message: "authentication.failed" });
    }
    req.login(user, async (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      await prismaClient.userSessionSubscription.upsert({
        where: {
          userSessionSubscriptionId:
            (
              await prismaClient.userSessionSubscription.findFirst({
                where: { userId: user.userId },
              })
            )?.userSessionSubscriptionId || "",
        },
        create: {
          userId: user.userId,
          sessId: req.session.id,
        },
        update: {
          sessId: req.session.id,
        },
      });

      return res.send({
        success: true,
      });
    });
  })(req, res, next);
};
