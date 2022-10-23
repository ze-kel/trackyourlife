import { FastifyPluginCallback } from "fastify";

import DB from "./db";
import { ITrackable, ITrackableUnsaved, ITrackableUpdate } from "@t/trackable";

const trackablesRoutes: FastifyPluginCallback = (fastify, options, done) => {
  fastify.get("/trackables", async (req, reply) => {
    const data = await DB.getTrackables();
    reply.send(data);
  });

  fastify.get("/trackable/:id", async (req, reply) => {
    const { id } = req.params as { id: string };

    const item = await DB.getTrackable(id);
    if (!item) {
      reply.code(404).send();
    }

    reply.send(item);
  });

  fastify.post("/trackables", async (req, reply) => {
    const saved = await DB.addTrackable(req.body as ITrackableUnsaved);
    reply.send(saved);
  });

  fastify.put("/trackable/:id", async (req, reply) => {
    const { id } = req.params as { id: string };

    const updated = await DB.updateTrackable(id, req.body as ITrackableUpdate);
    reply.send(updated);
  });

  fastify.put("/trackable/:id/settings", async (req, reply) => {
    const { id } = req.params as { id: string };

    const updated = await DB.updateTrackableSettings(
      id,
      req.body as ITrackable["settings"]
    );
    reply.send(updated);
  });

  fastify.delete("/trackable/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    await DB.deleteTrackable(id);

    reply.send();
  });

  done();
};

export default trackablesRoutes;
