import fastify from "fastify";
import { prisma } from "./lib/prisma.js";
import { saveOltDataOnInit } from "./save-olt-data-on-init.js";
import type { OltData } from "@prisma/client";
import fastifyCors from "@fastify/cors";

const HOST = process.env.HOST ?? "0.0.0.0";
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

saveOltDataOnInit();

const app = fastify({ logger: true, trustProxy: true });

app.register(fastifyCors, {
  origin: "*",
});

app.get("/", () => {
  return { status: "OK" };
});

// TODO: Para sistemas simples não é necessário dividir o código em camadas (controller, service, use cases, ...), adicionar caso o sistema cresça.
app.post("/olt-data", async (request, reply) => {
  const body = request.body as OltData[];

  if (!body || body.length === 0) {
    return reply.status(400).send({ error: "Body é obrigatório" });
  }

  try {
    await prisma.oltData.createMany({
      data: body,
      skipDuplicates: true,
    });

    return reply.status(201).send({ message: "Dados inseridos com sucesso" });
  } catch (error) {
    console.error(error);
    return reply.status(400).send({ error: "Erro ao inserir dados" });
  }
});

app.get("/olt-data", async () => {
  return prisma.oltData.findMany();
});

app.patch("/olt-data", async (request, reply) => {
  const body = request.body as (Partial<OltData> & { id: number })[];

  if (!body || body.length === 0) {
    return reply.status(400).send({ error: "Body é obrigatório" });
  }

  try {
    await Promise.all(
      body.map((data) => {
        const { id, ...rest } = data;

        const oltDataExists = prisma.oltData.findUnique({ where: { id } });

        // TODO: Saltamos a atualização se o registro não existir, deveriamos retornar um erro?
        if (!oltDataExists) {
          return Promise.resolve();
        }

        return prisma.oltData.update({ where: { id }, data: rest });
      })
    );
  } catch (error) {
    console.error(error);
    return reply.status(400).send({ error: "Erro ao atualizar dados" });
  }
});

app.delete("/olt-data", async (request, reply) => {
  const body = request.body as { ids: number[] };

  if (!body || body.ids.length === 0) {
    return reply.status(400).send({ error: "Body é obrigatório" });
  }

  try {
    await prisma.oltData.deleteMany({
      where: {
        id: {
          in: body.ids,
        },
      },
    });

    return reply.status(200).send({ message: "Dados deletados com sucesso" });
  } catch (error) {
    console.error(error);
    return reply.status(400).send({ error: "Erro ao deletar dados" });
  }
});

app.listen({ host: HOST, port: PORT }).then((url) => {
  console.log(`Server listen at ${url}`);
});
