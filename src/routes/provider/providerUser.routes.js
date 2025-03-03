import express from "express";
import {
  createProviderUser,
  updateProviderUser,
  deleteProviderUser,
  getProviderUser,
  getAllProviderUsers,
  deleteBulkProviderUsers,
  deleteAllProviderUsers,
} from "../../controllers/provider/providerUser.controller.js";

const providerUserRouter = express.Router();

// Create a new user
providerUserRouter.post("/users", createProviderUser);

// Update an existing user
providerUserRouter.put("/users/:userId", updateProviderUser);

// Delete a user
providerUserRouter.delete("/users/:userId", deleteProviderUser);

// Get a user by ID
providerUserRouter.get("/users/:userId", getProviderUser);

// Get all users (with pagination)
providerUserRouter.get("/users", getAllProviderUsers);

// Bulk delete users
providerUserRouter.delete("/users/bulk", deleteBulkProviderUsers);

// Delete all users
providerUserRouter.delete("/users/all", deleteAllProviderUsers);

export default providerUserRouter;
