import express from "express";
import {
  addTenant,
  updateTenant,
  deleteTenant,
  getTenantById,
  getAllTenants,
  bulkDeleteTenants,
  deleteAllTenants,
} from "../../controllers/tenant/tenant.controller.js";

const tenantRouter = express.Router();

// Add a new tenant
tenantRouter.post("/", addTenant);

// Update a tenant by ID
tenantRouter.put("/:id", updateTenant);

// Delete a tenant by ID
tenantRouter.delete("/:id", deleteTenant);

// Get a tenant by ID
tenantRouter.get("/:id", getTenantById);

// Get all tenants
tenantRouter.get("/", getAllTenants);

// Bulk delete tenants by IDs
tenantRouter.delete("/bulk", bulkDeleteTenants);

// Delete all tenants
tenantRouter.delete("/", deleteAllTenants);

export default tenantRouter;
