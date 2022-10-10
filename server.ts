import Fastify from "fastify";
import Fnext from "@fastify/nextjs";

import trackableRoutes from "./routes/trackable";
import mongoose from "mongoose";

const PORT = Number(process.env.PORT) || 1337;

const fastify = Fastify({ logger: false });

try {
  mongoose.connect(
    "mongodb://dbadmin:samplepass@mongo:27017/?authSource=admin"
  );
  console.log("Connect to DB success");
} catch (e) {
  console.log("failed to connect");
}

fastify
  .register(Fnext, { dev: process.env.NODE_ENV !== "production" })
  .after(() => {
    fastify.next("/*");
  });

fastify.register(trackableRoutes, { prefix: "/api/v1" });

fastify.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) throw err;
  console.log(`Server listening on http://localhost:${PORT}`);
});

export {};
