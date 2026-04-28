import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";

async function bootstrap() {
  await prisma.$connect();
  const server = app.listen(env.port, () => {
    console.log(`Backend server running on port ${env.port}`);
  });

  async function shutdown(signal) {
    console.log(`Received ${signal}. Shutting down...`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

bootstrap().catch(async (error) => {
  console.error("Failed to start server:", error);
  await prisma.$disconnect();
  process.exit(1);
});
