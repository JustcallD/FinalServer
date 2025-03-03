import mongoose from "mongoose";
import Role from "../../models/master/roleMaster.model.js";

/**
 * @desc    Create a new role
 * @route   POST /api/roles
 * @access  Public
 */
const createRole = async (req, res) => {
  try {
    const { roleName, modules } = req.body;

    if (!roleName) {
      return res
        .status(400)
        .json({ success: false, message: "Role name is required" });
    }

    // Validate modules array
    if (modules && !Array.isArray(modules)) {
      return res
        .status(400)
        .json({ success: false, message: "Modules must be an array" });
    }

    const role = new Role({ roleName, modules });
    await role.save();

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
    console.error("Error creating role:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * @desc    Get all roles with populated modules and screens
 * @route   GET /api/roles
 * @access  Public
 */
const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate({
      path: "modules",
      populate: { path: "screens" },
    });

    if (!roles.length) {
      return res
        .status(404)
        .json({ success: false, message: "No roles found" });
    }

    return res.status(200).json({ success: true, data: roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * @desc    Get a single role by ID
 * @route   GET /api/roles/:id
 * @access  Public
 */
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid role ID" });
    }

    const role = await Role.findById(id).populate({
      path: "modules",
      populate: { path: "screens" },
    });

    if (!role) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }

    return res.status(200).json({ success: true, data: role });
  } catch (error) {
    console.error("Error fetching role:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * @desc    Update a role
 * @route   PUT /api/roles/:id
 * @access  Public
 */
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName, modules } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid role ID" });
    }

    // Validate modules array
    if (modules && !Array.isArray(modules)) {
      return res
        .status(400)
        .json({ success: false, message: "Modules must be an array" });
    }

    const role = await Role.findByIdAndUpdate(
      id,
      { roleName, modules },
      { new: true }
    ).populate({
      path: "modules",
      populate: { path: "screens" },
    });

    if (!role) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: role,
    });
  } catch (error) {
    console.error("Error updating role:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * @desc    Delete a role
 * @route   DELETE /api/roles/:id
 * @access  Public
 */
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid role ID" });
    }

    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      return res
        .status(404)
        .json({ success: false, message: "Role not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export { createRole, getRoles, getRoleById, updateRole, deleteRole };
