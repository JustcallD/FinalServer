import Provider from "../../models/provider/provider.model.js";

const getProvider = async (req, res) => {
  try {
    // Pagination defaults to page 0 if not specified
    const page = req.query.page ? parseInt(req.query.page) : 0;

    // Fetch the provider along with clients
    const provider = await Provider.findOne()
      .select("provName provEmail provClients")
      .populate({
        path: "provClients",
      })
      .skip(page * 10)
      .limit(10);

    if (!provider) {
      // Return a 404 error if no provider is found
      return res.status(404).json({ message: "Provider not found" });
    }

    // Respond with the provider data and the associated clients
    res.status(200).json({
      message: "Provider fetched successfully",
      provider,
    });
  } catch (error) {
    // Catch and log any errors
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later." });
  }
};

export { getProvider };
