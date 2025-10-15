import fastify from "fastify";
import { prisma } from "./lib/prisma.js";
import { onInit } from "./on-init.js";

const HOST = process.env.HOST ?? "0.0.0.0";
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

onInit();

const app = fastify({ logger: true });

app.get("/", () => {
  return { status: "OK" };
});

app.get("/olt-data", async () => {
  return prisma.oltData.findMany();
});

app.listen({ host: HOST, port: PORT }).then((url) => {
  console.log(`Server listen at ${url}`);
});
