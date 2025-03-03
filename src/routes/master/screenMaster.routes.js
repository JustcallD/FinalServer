import express from "express";
import {
  createScreen,
  getScreens,
  getScreenById,
  updateScreen,
  deleteScreen,
} from "../../controllers/master/screenMaster.controller.js";

// import {
//   createScreen,
//   getScreens,
//   getScreenById,
//   updateScreen,
//   deleteScreen,
// } from "../../controllers/master/screenController.js";

const screenMasterRouter = express.Router();

// Screen Routes
screenMasterRouter.post("/screens", createScreen);
screenMasterRouter.get("/screens", getScreens);
screenMasterRouter.get("/screens/:id", getScreenById);
screenMasterRouter.put("/screens/:id", updateScreen);
screenMasterRouter.delete("/screens/:id", deleteScreen);

export default screenMasterRouter;
