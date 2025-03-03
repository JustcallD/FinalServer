import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import connectToDatabase from "../src/configs/databaseConnection.config.js";
import Role from "../src/models/master/roleMaster.model.js";
import Provider from "../src/models/provider/provider.model.js";
import { hashPassword } from "../src/utils/argon2.utils.js";
import ProviderUser from "../src/models/provider/providerUser.model.js";

const createSuperAdminAndUser = async () => {
  try {
    await connectToDatabase();

    // Step 1: Check if the superAdmin role exists
    let superAdminRole = await Role.findOne({ roleName: "superAdmin" });

    if (!superAdminRole) {
      superAdminRole = await Role.create({ roleName: "superAdmin" });
      console.log("SuperAdmin role created:", superAdminRole);
    } else {
      console.log("SuperAdmin role already exists:", superAdminRole);
    }

    // Step 2: Check if the provider exists
    let provider = await Provider.findOne({
      provEmail: "provider@example.com",
    });
    if (!provider) {
      provider = await Provider.create({
        provName: "Test Provider",
        provEmail: "provider@example.com",
      });
      console.log("Provider created:", provider);
    } else {
      console.log("Provider already exists:", provider);
    }

    let user = await ProviderUser.findOne({ email: "adminuser@example.com" });
    if (!user) {
      const password = "SuperSecurePassword123";
      const passwordHash = await hashPassword(password);

      user = await ProviderUser.create({
        username: "adminUser",
        email: "adminuser@example.com",
        role: superAdminRole._id,
        passwordHash: passwordHash,
        provider: provider._id,
      });

      console.log("User created:", user);
    } else {
      console.log("User already exists:", user);
    }
  } catch (error) {
    console.error("Error creating data:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

createSuperAdminAndUser();
