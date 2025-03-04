import express from "express";
import {   
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule 
} from "../../controllers/master/moduleMaster.controller.js";

const moduleMasterRouter = express.Router();

// Module Routes - Following RESTful conventions
moduleMasterRouter.post("/", createModule);
moduleMasterRouter.get("/", getAllModules);
moduleMasterRouter.get("/:moduleId", getModuleById);
moduleMasterRouter.put("/:moduleId", updateModule);
moduleMasterRouter.delete("/:moduleId", deleteModule);

export default moduleMasterRouter;
