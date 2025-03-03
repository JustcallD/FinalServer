import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    subsName: {
      type: String,
      required: [true, "Subscriber name is required"],
      trim: true,
      minlength: [3, "Subscriber name must be at least 3 characters"],
      maxlength: [100, "Subscriber name must be less than 100 characters"],
    },
    subsEmail: {
      type: String,
      required: [true, "Subscriber email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true, // By default, the tenant is active
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;
