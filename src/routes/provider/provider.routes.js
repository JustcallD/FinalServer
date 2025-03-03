import express from "express";
import { getProvider } from "../../controllers/provider/provider.controller.js";

const providerRouter = express.Router();

providerRouter.get("/getProvider", getProvider);

export default providerRouter;
