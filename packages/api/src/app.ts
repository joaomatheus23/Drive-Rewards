import Fastify from "fastify";
import registerPlugins from "./plugins/index.js";
import { registerRoutes } from "./routes/index.js";
import { errorHandler } from "./middleware/error-handler.js";
import { connectDatabase } from "./config/database.js";
import type { Env } from "./config/env.js";

/** Build and configure the Fastify application instance */
export async function buildApp(env: Env) {
  const app = Fastify({
    logger: { level: env.NODE_ENV === "production" ? "info" : "debug" },
  });

  app.setErrorHandler(errorHandler);

  await app.register(registerPlugins, env);
  await registerRoutes(app);

  app.addHook("onClose", async () => {
    const { disconnectDatabase } = await import("./config/database.js");
    await disconnectDatabase();
  });

  return app;
}

/** Start the server — connects DB then listens */
export async function startServer(env: Env): Promise<void> {
  await connectDatabase(env);
  const app = await buildApp(env);

  try {
    await app.listen({ port: env.PORT, host: env.HOST });
    console.log(`[api] Server running at http://${env.HOST}:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}
