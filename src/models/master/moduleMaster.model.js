import mongoose from "mongoose";

// Module Schema (linking Screens)
const ModuleMasterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    screens: [{ type: mongoose.Schema.Types.ObjectId, ref: "screenMaster" }], // Fixed reference
  },
  {
    timestamps: true,
  }
);

const Module = mongoose.model("moduleMaster", ModuleMasterSchema);
export default Module;
