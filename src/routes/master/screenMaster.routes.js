import express from "express";
import {
  createScreen,
  getAllScreens,
  getScreenById,
  updateScreen,
  deleteScreen,
} from "../../controllers/master/screenMaster.controller.js";

const screenMasterRouter = express.Router();

// Screen Routes - Following RESTful conventions
screenMasterRouter.post("/", createScreen);
screenMasterRouter.get("/", getAllScreens);
screenMasterRouter.get("/:screenId", getScreenById);
screenMasterRouter.put("/:screenId", updateScreen);
screenMasterRouter.delete("/:screenId", deleteScreen);

export default screenMasterRouter;