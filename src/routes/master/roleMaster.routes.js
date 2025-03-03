import express from "express";
import {
  createRole,
  deleteRole,
  getRoles,
  getRoleById,
  updateRole,
} from "../../controllers/master/roleMaster.controller.js";

const roleMasterRouter = express.Router();

roleMasterRouter.post("/role", createRole); // Create a new role
roleMasterRouter.get("/role/:id", getRoleById); // Get a specific role
roleMasterRouter.get("/roles", getRoles); // Get all roles
roleMasterRouter.put("/role/:id", updateRole); // Update a role
roleMasterRouter.delete("/role/:id", deleteRole); // Delete a role

export default roleMasterRouter;
