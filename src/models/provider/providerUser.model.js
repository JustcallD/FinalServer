import mongoose from "mongoose";

// Define the providerUser schema
const providerUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // You can uncomment and reference a valid 'roleMaster' schema if you have it
    // role: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "roleMaster",
    // },
    passwordHash: {
      type: String,
      required: true,
      minlength: 6,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the ProviderUser model
const ProviderUser = mongoose.model("ProviderUser", providerUserSchema);

export default ProviderUser;
