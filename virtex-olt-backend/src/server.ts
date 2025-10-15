import fastify from "fastify";
import { prisma } from "./lib/prisma.js";

const HOST = process.env.HOST ?? "0.0.0.0";
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = fastify({ logger: true });

app.get("/", () => {
  prisma.oltData.findMany().then((data) => {
    console.log(data);
  });
  return { status: "OK" };
});

app.listen({ host: HOST, port: PORT }).then((url) => {
  console.log(`Server listen at ${url}`);
});
