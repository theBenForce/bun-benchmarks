import { sleep, serve } from "bun";


const server = serve({
  async fetch(req) {
    return new Response("Hello World");
  },
  port: process.env.PORT || 3000
});

console.log(`Server is listening at ${server.url}`); 