import passportGoogle from "passport-google-oauth20";
import LocalStrategy from "passport-local";
import passport from "passport";
import prismaClient from "./prismaClient";
import { isNotDefined } from "./object";
import crypto from "crypto";

passport.use(
  new passportGoogle.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
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

passport.use(
  new LocalStrategy.Strategy({ usernameField: "email" }, async function verify(
    username,
    password,
    cb
  ) {
    const user = await prismaClient.user.findFirst({
      where: { email: username },
    });
    if (isNotDefined(user)) {
      return cb(null, false, {
        message: "Incorrect username or password.",
      });
    }

    const hashedPassword = crypto
      .pbkdf2Sync(password, user.salt, 1000, 64, `sha512`)
      .toString(`hex`);

    if (user.hashedPassword !== hashedPassword) {
      return cb(null, false, {
        message: "Incorrect username or password.",
      });
    }
    return cb(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (id, done) => {
  const user = await prismaClient.user.findFirst({ where: { userId: id } });
  done(null, user);
});

export default passport;
