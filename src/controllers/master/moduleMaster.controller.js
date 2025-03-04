import Module from "../../models/master/moduleMaster.model.js";
import Screen from "../../models/master/screenMaster.model.js";
import mongoose from "mongoose";

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
 * Create a new module
 * @route   POST /api/modules
 * @access  Public
 */
const createModule = async (req, res) => {
  try {
    const { name, screens = [] } = req.body;

    // Validate input
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Module name is required and cannot be empty",
      });
    }

    // Check if module already exists (case-insensitive)
    const existingModule = await Module.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingModule) {
      return res.status(409).json({
        success: false,
        message: "A module with this name already exists",
      });
    }

    // Validate screens
    if (screens.length > 0) {
      const invalidScreenIds = screens.filter(
        (screenId) => !isValidObjectId(screenId)
      );
      if (invalidScreenIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid screen IDs: ${invalidScreenIds.join(", ")}`,
        });
      }

      // Check if all screens exist
      const existingScreens = await Screen.find({
        _id: { $in: screens },
      });
      if (existingScreens.length !== screens.length) {
        const foundScreenIds = existingScreens.map((screen) =>
          screen._id.toString()
        );
        const missingScreens = screens.filter(
          (id) => !foundScreenIds.includes(id)
        );
        return res.status(404).json({
          success: false,
          message: `Screens not found: ${missingScreens.join(", ")}`,
        });
      }
    }

    // Create new module
    const module = new Module({
      name: name.trim(),
      screens,
    });
    await module.save();

    res.status(201).json({
      success: true,
      message: "Module created successfully",
      data: module,
    });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

/**
 * Get all modules
 * @route   GET /api/modules
 * @access  Public
 */
const getAllModules = async (req, res) => {
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
      ? { name: { $regex: search, $options: "i" } }
      : {};

    // Build sort options
    const sortOptions = {
      [sortBy]: sortOrder === "desc" ? -1 : 1,
    };

    // Pagination
    const skip = (page - 1) * limit;

    // Fetch modules with pagination and population
    const [modules, total] = await Promise.all([
      Module.find(searchQuery)
        .populate("screens")
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Module.countDocuments(searchQuery),
    ]);

    // Handle no modules found
    if (modules.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No modules found",
      });
    }

    res.status(200).json({
      success: true,
      data: modules,
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
 * Get a single module by ID
 * @route   GET /api/modules/:moduleId
 * @access  Public
 */
const getModuleById = async (req, res) => {
  try {
    const { moduleId } = req.params;

    // Validate ID
    if (!isValidObjectId(moduleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID",
      });
    }

    const module = await Module.findById(moduleId).populate("screens");
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    res.status(200).json({
      success: true,
      data: module,
    });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

/**
 * Update a module
 * @route   PUT /api/modules/:moduleId
 * @access  Public
 */
const updateModule = async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { name, screens } = req.body;

    // Validate ID
    if (!isValidObjectId(moduleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID",
      });
    }

    // Validate input
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Module name is required and cannot be empty",
      });
    }

    // Validate screens (if provided)
    if (screens && screens.length > 0) {
      const invalidScreenIds = screens.filter(
        (screenId) => !isValidObjectId(screenId)
      );
      if (invalidScreenIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid screen IDs: ${invalidScreenIds.join(", ")}`,
        });
      }

      // Check if all screens exist
      const existingScreens = await Screen.find({
        _id: { $in: screens },
      });
      if (existingScreens.length !== screens.length) {
        const foundScreenIds = existingScreens.map((screen) =>
          screen._id.toString()
        );
        const missingScreens = screens.filter(
          (id) => !foundScreenIds.includes(id)
        );
        return res.status(404).json({
          success: false,
          message: `Screens not found: ${missingScreens.join(", ")}`,
        });
      }
    }

    // Check if module exists before updating
    const existingModule = await Module.findById(moduleId);
    if (!existingModule) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    // Check for duplicate name (case-insensitive)
    const duplicateModule = await Module.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      _id: { $ne: moduleId },
    });
    if (duplicateModule) {
      return res.status(409).json({
        success: false,
        message: "A module with this name already exists",
      });
    }

    // Update module
    const updatedModule = await Module.findByIdAndUpdate(
      moduleId,
      {
        name: name.trim(),
        screens: screens || existingModule.screens,
      },
      { new: true, runValidators: true }
    ).populate("screens");

    res.status(200).json({
      success: true,
      message: "Module updated successfully",
      data: updatedModule,
    });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

/**
 * Delete a module
 * @route   DELETE /api/modules/:moduleId
 * @access  Public
 */
const deleteModule = async (req, res) => {
  try {
    const { moduleId } = req.params;

    // Validate ID
    if (!isValidObjectId(moduleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid module ID",
      });
    }

    const module = await Module.findByIdAndDelete(moduleId);
    if (!module) {
      return res.status(404).json({
        success: false,
        message: "Module not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Module deleted successfully",
    });
  } catch (error) {
    return handleErrorResponse(res, error);
  }
};

export {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
};
