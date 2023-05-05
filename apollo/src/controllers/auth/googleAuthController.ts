import passportGoogle from "passport-google-oauth20";
import { Request, Response } from "express";
import passport from "passport";
import prismaClient from "../../internal/prismaClient";

const GoogleStrategy = passportGoogle.Strategy;
export const auth_google = async (req: Request, res: Response) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.HOME,
      },
      async function (accessToken, refreshToken, profile, done) {
        const user = await prismaClient.user.findFirst({
          where: { accounts: { every: { providerAccountId: profile.id } } },
        });
        // If user doesn't exist creates a new user. (similar to sign up)
        if (!user) {
          const newUser = await prismaClient.user.create({
            data: {
              accounts: {
                create: {
                  provider: "GOOGLE",
                  providerAccountId: profile.id,
                },
              },
              email: profile.emails?.[0].value,
              name: profile.displayName,
            },
          });
          if (newUser) {
            done(null, newUser);
          }
        } else {
          done(null, user);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.userId);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await prismaClient.user.findFirst({ where: { userId: id } });
    done(null, user);
  });
};
