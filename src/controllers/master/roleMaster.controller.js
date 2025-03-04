import mongoose from "mongoose";
import Role from "../../models/master/roleMaster.model.js";
import Module from "../../models/master/moduleMaster.model.js";

// Utility function for validating MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Centralized error response handler
const handleErrorResponse = (
  res,
  error,
  customMessage = "Internal server error"
) => {
  console.error(error);
  return res.status(500).json({
    success: false,
    message: customMessage,
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};

/**
 * Create a new role
 * @route   POST /api/roles
 * @access  Public
 */
const createRole = async (req, res) => {
  try {
    const { roleName, modules = [] } = req.body;

    // Validate role name
    if (!roleName || roleName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Role name is required and cannot be empty",
      });
    }

    // Check for duplicate role name (case-insensitive)
    const existingRole = await Role.findOne({
      roleName: { $regex: new RegExp(`^${roleName}$`, "i") },
    });
    if (existingRole) {
      return res.status(409).json({
        success: false,
        message: "A role with this name already exists",
      });
    }

    // Validate modules
    if (modules.length > 0) {
      // Check for valid module IDs
      const invalidModuleIds = modules.filter(
        (moduleId) => !isValidObjectId(moduleId)
      );
      if (invalidModuleIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid module IDs: ${invalidModuleIds.join(", ")}`,
        });
      }

      // Verify all modules exist
      const existingModules = await Module.find({
        _id: { $in: modules },
      });
      if (existingModules.length !== modules.length) {
        const foundModuleIds = existingModules.map((module) =>
          module._id.toString()
        );
        const missingModules = modules.filter(
          (id) => !foundModuleIds.includes(id)
        );
        return res.status(404).json({
          success: false,
          message: `Modules not found: ${missingModules.join(", ")}`,
        });
      }
    }

    // Create new role
    const role = new Role({
      roleName: roleName.trim(),
      modules,
    });
    await role.save();

    // Populate role with modules and screens
    const populatedRole = await Role.findById(role._id).populate({
      path: "modules",
      populate: { path: "screens" },
    });

    return res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: populatedRole,
    });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

/**
 * Get all roles
 * @route   GET /api/roles
 * @access  Public
 */
const getAllRoles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build search query
    const searchQuery = search
      ? { roleName: { $regex: search, $options: "i" } }
      : {};

    // Build sort options
    const sortOptions = {
      [sortBy]: sortOrder === "desc" ? -1 : 1,
    };

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch roles with pagination and population
    const [roles, total] = await Promise.all([
      Role.find(searchQuery)
        .populate({
          path: "modules",
          populate: { path: "screens" },
        })
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Role.countDocuments(searchQuery),
    ]);

    // Handle no roles found
    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No roles found",
      });
    }

    return res.status(200).json({
      success: true,
      data: roles,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        limit: Number(limit),
      },
    });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

/**
 * Get a single role by ID
 * @route   GET /api/roles/:roleId
 * @access  Public
 */
const getRoleById = async (req, res) => {
  try {
    const { roleId } = req.params;

    // Validate ID
    if (!isValidObjectId(roleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role ID",
      });
    }

    const role = await Role.findById(roleId).populate({
      path: "modules",
      populate: { path: "screens" },
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

/**
 * Update a role
 * @route   PUT /api/roles/:roleId
 * @access  Public
 */
const updateRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { roleName, modules } = req.body;

    // Validate ID
    if (!isValidObjectId(roleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role ID",
      });
    }

    // Validate role name
    if (!roleName || roleName.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Role name is required and cannot be empty",
      });
    }

    // Check if role exists
    const existingRole = await Role.findById(roleId);
    if (!existingRole) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Check for duplicate role name (case-insensitive)
    const duplicateRole = await Role.findOne({
      roleName: { $regex: new RegExp(`^${roleName}$`, "i") },
      _id: { $ne: roleId },
    });
    if (duplicateRole) {
      return res.status(409).json({
        success: false,
        message: "A role with this name already exists",
      });
    }

    // Validate modules (if provided)
    if (modules && modules.length > 0) {
      // Check for valid module IDs
      const invalidModuleIds = modules.filter(
        (moduleId) => !isValidObjectId(moduleId)
      );
      if (invalidModuleIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid module IDs: ${invalidModuleIds.join(", ")}`,
        });
      }

      // Verify all modules exist
      const existingModules = await Module.find({
        _id: { $in: modules },
      });
      if (existingModules.length !== modules.length) {
        const foundModuleIds = existingModules.map((module) =>
          module._id.toString()
        );
        const missingModules = modules.filter(
          (id) => !foundModuleIds.includes(id)
        );
        return res.status(404).json({
          success: false,
          message: `Modules not found: ${missingModules.join(", ")}`,
        });
      }
    }

    // Update role
    const updatedRole = await Role.findByIdAndUpdate(
      roleId,
      {
        roleName: roleName.trim(),
        modules: modules || existingRole.modules,
      },
      { new: true, runValidators: true }
    ).populate({
      path: "modules",
      populate: { path: "screens" },
    });

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: updatedRole,
    });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

/**
 * Delete a role
 * @route   DELETE /api/roles/:roleId
 * @access  Public
 */
const deleteRole = async (req, res) => {
  try {
    const { roleId } = req.params;

    // Validate ID
    if (!isValidObjectId(roleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role ID",
      });
    }

    const role = await Role.findByIdAndDelete(roleId);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export { createRole, getAllRoles, getRoleById, updateRole, deleteRole };
