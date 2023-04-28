import { CorsOptions } from "apollo-server-express";
import {
  auth_sign_in_password,
  auth_sign_up_password,
} from "../src/controllers/authController";
import { operations_store } from "../src/controllers/operationStoreController";
const express = require("express");
const router = express.Router();
const cors = require("cors");

const corsOptions = {
  origin: [
    "http://localhost:5173, https://local.tablesfraternelles.org",
    "https://tablesfraternelles.orpaille.fr",
  ],
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "POST"],
} as CorsOptions;
router.use(cors(corsOptions));

router.use(express.urlencoded({ extended: true }));

// Authentication APIs
router.post("/auth/sign-in/password", auth_sign_in_password);
router.post("/auth/sign-up/password", auth_sign_up_password);

// Store graphql operations
router.post("/operations", operations_store);

export default router;
