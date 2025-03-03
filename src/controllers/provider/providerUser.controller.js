// import Role from "../../models/master/roleMaster.model";
import Provider from "../../models/provider/provider.model.js";
import ProviderUser from "../../models/provider/providerUser.model.js";
import { hashPassword } from "../../utils/argon2.utils.js";

const createProviderUser = async (req, res) => {
  try {
    const { username, email, password, role, provider } = req.body;

    // Validate input data
    if (!username || !email || !password || !provider) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists by email
    const existingUser = await ProviderUser.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `A user with the email ${email} already exists.` });
    }

    // Check if the provider exists by provName
    const existingProvider = await Provider.findOne({ provName: provider });
    if (!existingProvider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Check if the role exists by roleName
    // const existingRole = await Role.findOne({ roleName: role });
    // if (!existingRole) {
    //   return res.status(400).json({ message: `Role ${role} does not exist.` });
    // }

    // Ensure isActive is a boolean, if provided
    //   if (typeof isActive !== "undefined" && typeof isActive !== "boolean") {
    //     return res
    //       .status(400)
    //       .json({ message: "isActive must be a boolean value" });
    //   }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create the new user
    const newUser = await ProviderUser.create({
      username,
      email,
      passwordHash,
      //   role: existingRole._id,
      provider: existingProvider._id,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

// 2. Update an existing user
const updateProviderUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, password, role, provider, isActive } = req.body;

    // Check if the user exists
    const user = await ProviderUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If password is being updated, hash the new password
    let passwordHash = user.passwordHash;
    if (password) {
      passwordHash = await hashPassword(password);
    }

    // Update the user details
    user.username = username || user.username;
    user.email = email || user.email;
    user.passwordHash = passwordHash;
    // user.role = role || user.role;
    user.provider = provider || user.provider;
    user.isActive = isActive !== undefined ? isActive : user.isActive;

    // Save the updated user
    await user.save();

    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 3. Delete a single user
const deleteProviderUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find and delete the user by ID
    const user = await ProviderUser.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 4. Get a single user by ID
const getProviderUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await ProviderUser.findById(userId).populate("provider");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 5. Get all users with optional pagination
const getAllProviderUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const users = await ProviderUser.find()
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select("-passwordHash")
      .populate("provider", "provName provEmail")
      .lean();

    const totalUsers = await ProviderUser.countDocuments();

    return res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 6. Bulk delete users
const deleteBulkProviderUsers = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide an array of user IDs" });
    }

    // Delete multiple users
    const result = await ProviderUser.deleteMany({ _id: { $in: userIds } });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No users found to delete" });
    }

    return res
      .status(200)
      .json({ message: `${result.deletedCount} users deleted successfully` });
  } catch (error) {
    console.error("Error deleting users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// 7. Delete all users
const deleteAllProviderUsers = async (req, res) => {
  try {
    // Delete all users
    const result = await ProviderUser.deleteMany();

    return res
      .status(200)
      .json({ message: `${result.deletedCount} users deleted successfully` });
  } catch (error) {
    console.error("Error deleting all users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export {
  createProviderUser,
  updateProviderUser,
  deleteProviderUser,
  getProviderUser,
  getAllProviderUsers,
  deleteBulkProviderUsers,
  deleteAllProviderUsers,
};
