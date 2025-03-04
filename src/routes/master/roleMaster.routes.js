import express from "express";
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRoleById,
  updateRole,
} from "../../controllers/master/roleMaster.controller.js";

const roleMasterRouter = express.Router();

// Role Routes - Following RESTful conventions
roleMasterRouter.post("/", createRole);
roleMasterRouter.get("/", getAllRoles);
roleMasterRouter.get("/:roleId", getRoleById);
roleMasterRouter.put("/:roleId", updateRole);
roleMasterRouter.delete("/:roleId", deleteRole);

export default roleMasterRouter;
