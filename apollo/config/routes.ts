import bodyParser from "body-parser";
import { operations_store } from "../src/controllers/operationStoreController";
import cors from "cors";
import express, { Router } from "express";
import { auth_google } from "../src/controllers/auth/googleAuthController";

const router = Router();

const corsOptions = {
  origin: [
    process.env.ENV === "dev" ? "http://localhost:3000" : "",
    "https://dev.fort-lisa.com",
    "https://fort-lisa.com",
  ],
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "POST"],
} as cors;

router.use(cors(corsOptions));
router.use(express.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Authentication APIs
router.post("/auth/google", auth_google);
// router.post("/auth/sign-up/password", auth_sign_up_password);

// Store graphql operations
router.post("/operations", operations_store);

export default router;
