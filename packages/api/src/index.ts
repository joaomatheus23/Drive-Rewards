import { loadDotenv } from "./config/load-dotenv.js";
import { loadEnv } from "./config/env.js";
import { startServer } from "./app.js";

loadDotenv();
const env = loadEnv();
startServer(env);
