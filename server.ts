import Fastify from "fastify";
import Fnext from "@fastify/nextjs";

//const trackablesRoutes = require('./routes/trackable');
import trackableRoutes from "./routes/trackable";

const PORT = 1337;

const fastify = Fastify({ logger: false });

fastify
  .register(Fnext, { dev: process.env.NODE_ENV !== "production" })
  .after(() => {
    fastify.next("/*");
  });

fastify.register(trackableRoutes, { prefix: "/api/v1" });

fastify.listen({ port: PORT }, (err) => {
  if (err) throw err;
  console.log(`Server listening on <http://localhost:${PORT}>`);
});

export {};
