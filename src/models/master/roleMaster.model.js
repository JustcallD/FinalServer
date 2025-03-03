import mongoose from "mongoose";

// Role Schema (linking Modules)
const RoleMasterSchema = new mongoose.Schema(
  {
    roleName: { type: String, required: true, unique: true },
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "moduleMaster" }], 
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("roleMaster", RoleMasterSchema);
export default Role;
