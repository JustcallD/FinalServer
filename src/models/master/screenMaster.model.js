import mongoose from "mongoose";

const ScreenMasterSchema = new mongoose.Schema(
  {
    screenName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true, // Ensures that screens are active by default
    },
    // permissions: [
    //   {
    //     role: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: "Role",
    //     },
    //     actions: {
    //       type: [String],
    //       enum: ["read", "create", "update", "delete"],
    //       default: ["read"],
    //     },
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

// Middleware to auto-assign superAdmin permissions before saving (uncomment if needed)
// ScreenMasterSchema.pre("save", async function (next) {
//   try {
//     if (this.isNew && this.permissions.length === 0) {
//       const superAdminRole = await Role.findOne({ name: "superAdmin" });
//       if (superAdminRole) {
//         this.permissions.push({
//           role: superAdminRole._id,
//           actions: ["read", "create", "update", "delete"],
//         });
//       }
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

const Screen = mongoose.model("screenMaster", ScreenMasterSchema);
export default Screen;
