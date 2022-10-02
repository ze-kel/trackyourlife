import Fastify from 'fastify';
import Fnext from '@fastify/nextjs';

const fastify = Fastify({ logger: false });

async function noOpParser(req, payload) {
  return payload;
}

fastify.register(Fnext, { dev: process.env.NODE_ENV !== 'production' }).after(() => {
  fastify.addContentTypeParser('text/plain', noOpParser);
  fastify.addContentTypeParser('application/json', noOpParser);
  fastify.next('/*');
});

fastify.get('/api', async (request, reply) => {
  return { hello: 'world' };
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log('Server listening on <http://localhost:3000>');
});
