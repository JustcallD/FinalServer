import express from "express";
import moduleMasterRouter from "./moduleMaster.routes.js";
import roleMasterRouter from "./roleMaster.routes.js";
import screenMasterRouter from "./screenMaster.routes.js";

const masterRouter = express.Router();

masterRouter.use("/modules", moduleMasterRouter);
masterRouter.use("/roles", roleMasterRouter);
masterRouter.use("/screens", screenMasterRouter);

export default masterRouter;