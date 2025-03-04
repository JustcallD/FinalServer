import masterRouter from "./master/masterRouter.routes.js";
import providerRouter from "./provider/provider.routes.js";
import providerUserRouter from "./provider/providerUser.routes.js";
import tenantRouter from "./tenant/tenant.routes.js";

const mainRoutesRegistryObject = {
  "/providers": {
    router: providerRouter,
    // middleware: [authMiddleware, logMiddleware],
  },
  "/provider-users": {
    router: providerUserRouter,
  },
  "/master": {
    router: masterRouter,
    children: {
      "/modules": { router: masterRouter },
      "/roles": { router: masterRouter },
      "/screens": { router: masterRouter },
    },
  },
  "/tenants": {
    router: tenantRouter,
    // children: {
    //   "/users": { router: tenantUserRouter },
    //   "/settings": { router: tenantSettingsRouter },
    // },
  },
};

export default mainRoutesRegistryObject;
