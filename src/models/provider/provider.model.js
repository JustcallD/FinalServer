import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    provName: {
      type: String,
      required: [true, "Provider name is required"],
      trim: true,
    },
    provEmail: {
      type: String,
      required: [true, "Provider email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    provClients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
      },
    ],
  },
  { timestamps: true }
);

const Provider = mongoose.model("Provider", providerSchema);

export default Provider;
