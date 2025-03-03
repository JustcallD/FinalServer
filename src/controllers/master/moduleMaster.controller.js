import Module from "../../models/master/moduleMaster.model.js";
import Screen from "../../models/master/screenMaster.model.js";



/**
 * @desc    Create a new module
 * @route   POST /api/modules
 * @access  Public
 */
export const createModule = async (req, res) => {
  try {
    const { name, screens } = req.body;

    // Check if module name is provided
    if (!name) {
      return res.status(400).json({ success: false, message: "Module name is required" });
    }

    // Check if module already exists
    const existingModule = await Module.findOne({ name });
    if (existingModule) {
      return res.status(400).json({ success: false, message: "Module with this name already exists" });
    }

    // Validate screens (if provided)
    if (screens && screens.length > 0) {
      for (const screenId of screens) {
        if (!screenId.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ success: false, message: `Invalid screen ID: ${screenId}` });
        }
        const screenExists = await Screen.findById(screenId);
        if (!screenExists) {
          return res.status(404).json({ success: false, message: `Screen not found with ID: ${screenId}` });
        }
      }
    }

    // Create new module
    const module = new Module({ name, screens });
    await module.save();

    res.status(201).json({ success: true, message: "Module created successfully", data: module });
  } catch (error) {
    console.error("Error creating module:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @desc    Get all modules
 * @route   GET /api/modules
 * @access  Public
 */
export const getModules = async (req, res) => {
  try {
    const modules = await Module.find().populate("screens");

    if (modules.length === 0) {
      return res.status(404).json({ success: false, message: "No modules found" });
    }

    res.status(200).json({ success: true, data: modules });
  } catch (error) {
    console.error("Error fetching modules:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @desc    Get a single module by ID
 * @route   GET /api/modules/:id
 * @access  Public
 */
export const getModuleById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid module ID" });
    }

    const module = await Module.findById(id).populate("screens");
    if (!module) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    res.status(200).json({ success: true, data: module });
  } catch (error) {
    console.error("Error fetching module:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @desc    Update a module
 * @route   PUT /api/modules/:id
 * @access  Public
 */
export const updateModule = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, screens } = req.body;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid module ID" });
    }

    // Validate screens (if provided)
    if (screens && screens.length > 0) {
      for (const screenId of screens) {
        if (!screenId.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ success: false, message: `Invalid screen ID: ${screenId}` });
        }
        const screenExists = await Screen.findById(screenId);
        if (!screenExists) {
          return res.status(404).json({ success: false, message: `Screen not found with ID: ${screenId}` });
        }
      }
    }

    const module = await Module.findByIdAndUpdate(id, { name, screens }, { new: true }).populate("screens");

    if (!module) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    res.status(200).json({ success: true, message: "Module updated successfully", data: module });
  } catch (error) {
    console.error("Error updating module:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @desc    Delete a module
 * @route   DELETE /api/modules/:id
 * @access  Public
 */
export const deleteModule = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ success: false, message: "Invalid module ID" });
    }

    const module = await Module.findByIdAndDelete(id);
    if (!module) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    res.status(200).json({ success: true, message: "Module deleted successfully" });
  } catch (error) {
    console.error("Error deleting module:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
