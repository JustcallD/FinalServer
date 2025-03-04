import dotenv from "dotenv";
dotenv.config();

const allowedVercelOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "https://client-saas-tenent.vercel.app",
      "https://client-saas.vercel.app",
      "https://final-client-sigma.vercel.app",
    ];

// Allow all subdomains of `localhost:5173`
const localhostPattern = /^http:\/\/([a-zA-Z0-9-]+\.)?localhost:5173$/;

// Allow all subdomains of your production domain (e.g., `*.yourdomain.com`)
const productionDomainPattern = /^https:\/\/([a-zA-Z0-9-]+\.)?yourdomain\.com$/;

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      localhostPattern.test(origin) ||
      productionDomainPattern.test(origin) ||
      allowedVercelOrigins.includes(origin)
    ) {
      callback(null, true);
    } else {
      console.error(`🚫 CORS Blocked: Origin ${origin} is not allowed.`);
      callback(new Error("❌ Not allowed by CORS"), false);
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Subdomain"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export default corsOptions;
