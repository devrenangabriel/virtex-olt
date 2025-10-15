import fastify from "fastify";
import { prisma } from "./lib/prisma.js";
import { saveOltOnInit } from "./save-olt-data-on-init.js";

const HOST = process.env.HOST ?? "0.0.0.0";
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

saveOltOnInit();

const app = fastify({ logger: true });

app.get("/", () => {
  return { status: "OK" };
});

// TODO: Para sistemas simples não é necessário dividir o código em camadas (controller, service, use cases, ...), adicionar caso o sistema cresça.
app.get("/olt-data", async () => {
  return prisma.oltData.findMany();
});

app.listen({ host: HOST, port: PORT }).then((url) => {
  console.log(`Server listen at ${url}`);
});
