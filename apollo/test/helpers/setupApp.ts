import express from "express";
import router from "../../config/routes";
import { middlewares } from "../../src/middlewares";

export const createTestApp = async () => {
  const app = express();
  await (await middlewares()).map((middleware) => app.use(middleware));
  app.use("/api", router);
  return app;
};
