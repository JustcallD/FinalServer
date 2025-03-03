import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./configs/cors.config.js";
import mainRoutesRegistry from "./routes/mainRoutesRegistry.routes.js";
import routePrefix from "./configs/routePrefix.config.js";

// initializing express
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

/**
 * Register routes using an object for O(1) lookups
 */
const routeMap = {}; // Object for storing routes with O(1) access

const registerRoutes = (routes, basePath = "") => {
  for (const key in routes) {
    if (routes.hasOwnProperty(key)) {
      const route = routes[key];
      const fullPath = `${routePrefix.apiPrefix}${basePath}${key}`;

      // Store route in the object for O(1) lookups
      if (!routeMap[fullPath]) {
        routeMap[fullPath] = {
          router: route.router,
          middleware: route.middleware || [],
        };

        // Apply middleware if exists
        if (route.middleware && route.middleware.length > 0) {
          route.middleware.forEach((mw) => app.use(fullPath, mw));
        }

        // Register the router
        app.use(fullPath, route.router);
      }

      // Handle nested routes recursively
      if (route.children) {
        registerRoutes(route.children, `${basePath}${key}`);
      }
    }
  }
};

// mainRoutesRegistry.forEach((route) => {
//   // Apply middleware if exists
//   if (route.middleware && route.middleware.length > 0) {
//     route.middleware.forEach((middleware) => {
//       app.use(`${routePrefix.apiPrefix}${route.path}`, middleware);
//     });
//   }

//   // Apply the router after the middleware
//   app.use(`${routePrefix.apiPrefix}${route.path}`, route.router);
// });
registerRoutes(mainRoutesRegistry);

export default app;
