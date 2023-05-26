import { Request, Response } from "express";
import passport from "passport";

export const auth_google = async (req: Request, res: Response) => {
  passport.authenticate("google", {
    scope: ["email", "profile"],
  });
};

export const auth_google_callback = async (req: Request, res: Response) => {
  passport.authenticate("google", {
    failureRedirect: "/failed",
  }),
    function (req, res) {
      console.log("SUCCESS");
    };
};
