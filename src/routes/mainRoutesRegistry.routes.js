import masterRouter from "./master/masterRouter.routes.js";
import providerRouter from "./provider/provider.routes.js";
import providerUserRouter from "./provider/providerUser.routes.js";
import tenantRouter from "./tenant/tenant.routes.js";

const mainRoutesRegistryObject = {
  "/provider": {
    router: providerRouter,
    // middleware: [authMiddleware, logMiddleware],
  },
  "/provider-user": { router: providerUserRouter },
  "/master": {
    router: masterRouter,
    children: {
      "/modules": { router: masterRouter }, // Handles /master/modules
      "/roles": { router: masterRouter },   // Handles /master/roles
      "/screens": { router: masterRouter },   // Handles /master/roles
    },
  }, // <- Corrected bracket placement
  "/tenant": {
    router: tenantRouter,
    // children: {
    //   "/users": { router: tenantUserRouter },
    //   "/settings": { router: tenantSettingsRouter },
    // },
  },
};

export default mainRoutesRegistryObject;
