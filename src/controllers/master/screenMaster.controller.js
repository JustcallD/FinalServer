import Screen from "../../models/master/screenMaster.model.js";
import Role from "../../models/master/roleMaster.model.js";

/**
 * @desc    Create a new screen
 * @route   POST /api/screens
 * @access  Public
 */
const createScreen = async (req, res) => {
  try {
    const { name, permissions = [] } = req.body;

    // Validate screen name
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Screen name is required" });
    }

    // Check if screen already exists
    const existingScreen = await Screen.findOne({ name });
    if (existingScreen) {
      return res.status(400).json({
        success: false,
        message: "Screen with this name already exists",
      });
    }

    // Fetch superAdmin role if not already assigned
    const superAdminRole = await Role.findOne({ name: "superAdmin" });
    if (
      superAdminRole &&
      !permissions.some(
        (p) => p.role.toString() === superAdminRole._id.toString()
      )
    ) {
      permissions.push({
        role: superAdminRole._id,
        actions: ["read", "create", "update", "delete"],
      });
    }

    // Create and save the new screen
    const screen = new Screen({ name, permissions });
    await screen.save();

    res.status(201).json({
      success: true,
      message: "Screen created successfully",
      data: screen,
    });
  } catch (error) {
    console.error("Error creating screen:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @desc    Get all screens
 * @route   GET /api/screens
 * @access  Public
 */
const getScreens = async (req, res) => {
  try {
    const screens = await Screen.find().populate("permissions.role", "name");

    if (!screens.length) {
      return res
        .status(404)
        .json({ success: false, message: "No screens found" });
    }

    res.status(200).json({ success: true, data: screens });
  } catch (error) {
    console.error("Error fetching screens:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @desc    Get a single screen by ID
 * @route   GET /api/screens/:id
 * @access  Public
 */
const getScreenById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid screen ID" });
    }

    const screen = await Screen.findById(id).populate(
      "permissions.role",
      "name"
    );
    if (!screen) {
      return res
        .status(404)
        .json({ success: false, message: "Screen not found" });
    }

    res.status(200).json({ success: true, data: screen });
  } catch (error) {
    console.error("Error fetching screen:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @desc    Update a screen
 * @route   PUT /api/screens/:id
 * @access  Public
 */
const updateScreen = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid screen ID" });
    }

    // Fetch existing screen
    const screen = await Screen.findById(id);
    if (!screen) {
      return res
        .status(404)
        .json({ success: false, message: "Screen not found" });
    }

    // Fetch superAdmin role
    const superAdminRole = await Role.findOne({ name: "superAdmin" });
    if (
      superAdminRole &&
      !permissions.some(
        (p) => p.role.toString() === superAdminRole._id.toString()
      )
    ) {
      permissions.push({
        role: superAdminRole._id,
        actions: ["read", "create", "update", "delete"],
      });
    }

    // Update screen
    screen.name = name || screen.name;
    screen.permissions = permissions || screen.permissions;
    await screen.save();

    res.status(200).json({
      success: true,
      message: "Screen updated successfully",
      data: screen,
    });
  } catch (error) {
    console.error("Error updating screen:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * @desc    Delete a screen
 * @route   DELETE /api/screens/:id
 * @access  Public
 */
const deleteScreen = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid screen ID" });
    }

    const screen = await Screen.findByIdAndDelete(id);
    if (!screen) {
      return res
        .status(404)
        .json({ success: false, message: "Screen not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Screen deleted successfully" });
  } catch (error) {
    console.error("Error deleting screen:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { deleteScreen, updateScreen, getScreenById, getScreens, createScreen };
