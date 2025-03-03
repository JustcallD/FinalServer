import mongoose from "mongoose";
import Role from "./roleMaster.model.js";


const ScreenMasterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    permissions: [
      {
        role: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role",
          required: true,
        },
        actions: {
          type: [String],
          enum: ["read", "create", "update", "delete"],
          default: ["read"], 
          validate: {
            validator: (permissions) =>
              permissions.every((p) =>
                ["read", "create", "update", "delete"].includes(p)
              ),
            message: "Invalid permission value",
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Middleware to auto-assign superAdmin permissions before saving
ScreenMasterSchema.pre("save", async function (next) {
  try {
    if (this.isNew && this.permissions.length === 0) {
      const superAdminRole = await Role.findOne({ name: "superAdmin" });
      if (superAdminRole) {
        this.permissions.push({
          role: superAdminRole._id,
          actions: ["read", "create", "update", "delete"],
        });
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Screen = mongoose.model("screenMaster", ScreenMasterSchema);
export default Screen;

// import mongoose from "mongoose";
// import Role from "./Role.js"; // Import Role model to get superAdmin role

// const ScreenMasterSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     permissions: [
//       {
//         role: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Role",
//           required: true,
//         },
//         actions: {
//           type: [String],
//           validate: {
//             validator: (permissions) =>
//               permissions.every((p) =>
//                 ["read", "create", "update", "delete"].includes(p)
//               ),
//             message: "Invalid permission value",
//           },
//         },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// // Middleware to add default permissions for superAdmin before saving
// ScreenMasterSchema.pre("save", async function (next) {
//   try {
//     // Check if the screen already has permissions
//     if (this.permissions.length === 0) {
//       // Fetch superAdmin role ID
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

// const Screen = mongoose.model("screenMaster", ScreenMasterSchema);
// export default Screen;
