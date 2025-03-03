import Tenant from "../../models/tenant/tenant.model.js";

// Get a tenant by ID
const getTenantById = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Find the tenant by ID
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    return res.status(200).json({
      message: "Tenant fetched successfully",
      tenant,
    });
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

// Get all tenants
const getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find();
    return res.status(200).json({
      message: "Tenants fetched successfully",
      tenants,
    });
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

// Add a new tenant
const addTenant = async (req, res) => {
  try {
    const { subsName, subsEmail, isActive } = req.body;

    // Check if the tenant already exists by email
    const existingTenant = await Tenant.findOne({ subsEmail });
    if (existingTenant) {
      return res
        .status(400)
        .json({ message: "Tenant with this email already exists" });
    }

    // Create a new tenant
    const newTenant = new Tenant({
      subsName,
      subsEmail,
      isActive,
    });

    await newTenant.save();

    return res.status(201).json({
      message: "Tenant added successfully",
      tenant: newTenant,
    });
  } catch (error) {
    console.error("Error adding tenant:", error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

// Update tenant by ID
const updateTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { subsName, subsEmail, isActive } = req.body;

    // Find the tenant by ID and update it
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    tenant.subsName = subsName || tenant.subsName;
    tenant.subsEmail = subsEmail || tenant.subsEmail;
    tenant.isActive = isActive !== undefined ? isActive : tenant.isActive;

    await tenant.save();

    return res.status(200).json({
      message: "Tenant updated successfully",
      tenant,
    });
  } catch (error) {
    console.error("Error updating tenant:", error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

// Remove a tenant by ID
const deleteTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Find the tenant and remove it
    const tenant = await Tenant.findByIdAndDelete(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    return res.status(200).json({
      message: "Tenant removed successfully",
    });
  } catch (error) {
    console.error("Error removing tenant:", error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

// Bulk delete tenants
const bulkDeleteTenants = async (req, res) => {
  try {
    const { tenantIds } = req.body; // Expected to be an array of tenant IDs

    // Check if tenantIds is an array and not empty
    if (!Array.isArray(tenantIds) || tenantIds.length === 0) {
      return res
        .status(400)
        .json({ message: "No tenant IDs provided for deletion" });
    }

    // Delete multiple tenants by their IDs
    const result = await Tenant.deleteMany({ _id: { $in: tenantIds } });

    return res.status(200).json({
      message: `${result.deletedCount} tenant(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error bulk deleting tenants:", error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

// Delete all tenants
const deleteAllTenants = async (req, res) => {
  try {
    // Delete all tenants from the database
    const result = await Tenant.deleteMany({});

    return res.status(200).json({
      message: `${result.deletedCount} tenant(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting all tenants:", error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

export {
  addTenant,
  updateTenant,
  deleteTenant,
  getTenantById,
  getAllTenants,
  bulkDeleteTenants,
  deleteAllTenants,
};
