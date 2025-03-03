import express from "express";
import {   createModule,
    getModules,
    getModuleById,
    updateModule,
    deleteModule, } from "../../controllers/master/moduleMaster.controller.js";



const moduleMasterRouter = express.Router();

// Module Routes
moduleMasterRouter.post("/modules", createModule);
moduleMasterRouter.get("/modules", getModules);
moduleMasterRouter.get("/modules/:id", getModuleById);
moduleMasterRouter.put("/modules/:id", updateModule);
moduleMasterRouter.delete("/modules/:id", deleteModule);


export default moduleMasterRouter;
