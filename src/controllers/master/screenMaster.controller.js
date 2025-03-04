import Screen from "../../models/master/screenMaster.model.js";

/**
 * Create a new screen
 */
const createScreen = async (req, res) => {
  try {
    const { screenName, isActive } = req.body;

    // Validate that screenName exists and is not empty
    if (!screenName || screenName.trim() === "") {
      return res.status(400).json({ message: "Screen name is required" });
    }

    // Check if the screen already exists
    const existingScreen = await Screen.findOne({ screenName });
    if (existingScreen) {
      return res.status(400).json({ message: "Screen already exists" });
    }

    // Create new screen
    const newScreen = new Screen({
      screenName,
      isActive: isActive !== undefined ? isActive : true, // Default isActive to true if not provided
    });

    await newScreen.save();

    res
      .status(201)
      .json({ message: "Screen created successfully", screen: newScreen });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating screen", error: error.message });
  }
};

/**
 * Get all screens
 */
const getAllScreens = async (req, res) => {
  try {
    const screens = await Screen.find();
    res.status(200).json(screens);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching screens", error: error.message });
  }
};

/**
 * Get a single screen by ID
 */
const getScreenById = async (req, res) => {
  try {
    const { id } = req.params;
    const screen = await Screen.findById(id);

    if (!screen) {
      return res.status(404).json({ message: "Screen not found" });
    }

    res.status(200).json(screen);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching screen", error: error.message });
  }
};

/**
 * Update a screen by ID
 */
const updateScreen = async (req, res) => {
  try {
    const { id } = req.params;
    const { screenName, isActive } = req.body;

    // Validate that screenName exists and is not empty
    if (!screenName || screenName.trim() === "") {
      return res.status(400).json({ message: "Screen name is required" });
    }

    // Update the screen in the database
    const updatedScreen = await Screen.findByIdAndUpdate(
      id,
      { screenName, isActive },
      { new: true, runValidators: true }
    );

    if (!updatedScreen) {
      return res.status(404).json({ message: "Screen not found" });
    }

    res
      .status(200)
      .json({ message: "Screen updated successfully", screen: updatedScreen });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating screen", error: error.message });
  }
};

/**
 * Delete a screen by ID
 */
const deleteScreen = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedScreen = await Screen.findByIdAndDelete(id);

    if (!deletedScreen) {
      return res.status(404).json({ message: "Screen not found" });
    }

    res.status(200).json({ message: "Screen deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting screen", error: error.message });
  }
};

export {
  createScreen,
  getAllScreens,
  getScreenById,
  updateScreen,
  deleteScreen,
};
