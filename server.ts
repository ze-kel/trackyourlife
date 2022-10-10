import Fastify from "fastify";
import Fnext from "@fastify/nextjs";

import trackableRoutes from "./routes/trackable";
import mongoose from "mongoose";
import {
  MONGO_IP,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_USER,
} from "./config/config";
import { TrackableModel } from "./models/trackableModel";

const PORT = Number(process.env.PORT) || 1337;

const fastify = Fastify({ logger: false });

const DB_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectToDB = () => {
  let attemptsLeft = 5;
  const tryToConnect = (res, rej) => {
    try {
      mongoose.connect(DB_URL);
      res(true);
    } catch (e) {
      console.log(e);
      console.log(
        `Failed to connect to MONGODB. Retrying ${attemptsLeft} more times`
      );
      attemptsLeft--;
      if (attemptsLeft <= 0) {
        rej(false);
      }
      setTimeout(() => tryToConnect(res, rej), 5000);
    }
  };

  return new Promise(tryToConnect);
};

const main = async () => {
  await connectToDB().catch((e) => {
    console.log("Unable to connect to DB. Exiting.");
    process.exit(1);
  });
  console.log("Connected to MONGODB");

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
};

main();

export {};
