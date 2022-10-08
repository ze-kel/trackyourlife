import { FastifyPluginCallback } from "fastify";

import DB from "./db";
import { ITrackableUnsaved, ITrackableUpdate } from "@t/trackable";

const trackablesRoutes: FastifyPluginCallback = (fastify, options, done) => {
  fastify.get("/trackables", async (req, reply) => {
    const data = DB.getTrackables();
    reply.send(data);
  });

  fastify.get("/trackable/:id", async (req, reply) => {
    const { id } = req.params as { id: string };

    const item = DB.getTrackable(id);
    if (!item) {
      reply.code(404).send();
    }

    reply.send(item);
  });

  fastify.post("/trackables", async (req, reply) => {
    console.log("POST", req.body);

    const saved = DB.addTrackable(req.body as ITrackableUnsaved);
    reply.send(saved);
  });

  fastify.put("/trackable/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    console.log("PUT", req.body);

    const updated = DB.updateTrackable(id, req.body as ITrackableUpdate);
    console.log("updated", updated);
    reply.send(updated);
  });

  fastify.delete("/trackable/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    console.log("delete", id);
    DB.deleteTrackable(id);

    reply.send();
  });

  done();
};

export default trackablesRoutes;
