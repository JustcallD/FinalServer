import Module from "../../models/master/moduleMaster.model.js";
import Screen from "../../models/master/screenMaster.model.js";

// Create a new module
const createModule = async (req, res) => {
  try {
    const { name, screens } = req.body;
    console.log("screens ", screens);
    console.log("name ", name);

    // Validate screen IDs by checking if they exist in the screenMaster collection
    const validScreens = await Screen.find({ _id: { $in: screens } });
    // if (validScreens.length !== screens.length) {
    //   return res
    //     .status(400)
    //     .json({ message: "One or more screens are invalid." });
    // }

    console.log("validScreens ", validScreens);

    // Check if a module with the same name already exists
    const existingModule = await Module.findOne({ name });
    if (existingModule) {
      return res.status(400).json({ message: "Module already exists" });
    }

    // Create a new module
    const newModule = new Module({
      name,
      screens, // Screens are passed as ObjectIds
    });

    // Save the module to the database
    await newModule.save();
    return res
      .status(201)
      .json({ message: "Module created successfully", newModule });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get all modules
const getAllModules = async (req, res) => {
  try {
    const modules = await Module.find().populate("screens");
    return res.status(200).json(modules);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get a module by ID
const getModuleById = async (req, res) => {
  try {
    const moduleId = req.params.id;

    const module = await Module.findById(moduleId).populate("screens");
    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    return res.status(200).json(module);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Update a module
const updateModule = async (req, res) => {
  try {
    const moduleId = req.params.id;
    const { name, screens } = req.body;

    // Validate screen IDs by checking if they exist in the screenMaster collection
    const validScreens = await Screen.find({ _id: { $in: screens } });
    if (validScreens.length !== screens.length) {
      return res
        .status(400)
        .json({ message: "One or more screens are invalid." });
    }

    // Find and update the module by ID
    const updatedModule = await Module.findByIdAndUpdate(
      moduleId,
      { name, screens }, // Update name and screens
      { new: true } // Return the updated module
    );

    if (!updatedModule) {
      return res.status(404).json({ message: "Module not found" });
    }

    return res
      .status(200)
      .json({ message: "Module updated successfully", updatedModule });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// Delete a module
const deleteModule = async (req, res) => {
  try {
    const moduleId = req.params.id;

    // Find and delete the module by ID
    const deletedModule = await Module.findByIdAndDelete(moduleId);
    if (!deletedModule) {
      return res.status(404).json({ message: "Module not found" });
    }

    return res.status(200).json({ message: "Module deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export {
  createModule,
  getAllModules,
  getModuleById,
  updateModule,
  deleteModule,
};
