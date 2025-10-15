// src/server.ts
import fastify from "fastify";

// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient({ log: ["query"] });

// src/save-olt-data-on-init.ts
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// src/utils/parsers/huawei-parser.ts
var ANY_NUMBER_WITH_SLASH_REGEX = /\d+\//;
var SPLIT_REGEX = /\s{2,}/;
function isHuaweiOltData(data) {
  const requiredKeywords = ["F/S/P", "ONT", "SN", "Run", "state"];
  const normalizedData = data.toLowerCase();
  return requiredKeywords.every(
    (keyword) => normalizedData.includes(keyword.toLowerCase())
  );
}
function parseHuaweiOltData(data) {
  if (!isHuaweiOltData(data)) {
    throw new Error("Os dados fornecidos n\xE3o s\xE3o de uma OLT Huawei.");
  }
  const lines = data.split("\n");
  const firstIndex = lines.findIndex(
    (line) => ANY_NUMBER_WITH_SLASH_REGEX.test(line.slice(0, 5))
  );
  const lastIndex = lines.slice(firstIndex).findIndex((line) => !ANY_NUMBER_WITH_SLASH_REGEX.test(line.slice(0, 5)));
  const relevantLines = lines.slice(
    firstIndex,
    lastIndex !== -1 ? lastIndex + firstIndex : lines.length
  );
  const trimmedRelevantLines = relevantLines.map((line) => line.trim());
  const FSP_INDEX = 0;
  const ONT_INDEX = 1;
  const SN_INDEX = 2;
  const STATE_INDEX = 4;
  return trimmedRelevantLines.map((line) => {
    const columns = line.split(SPLIT_REGEX);
    if (!columns[FSP_INDEX]) {
      throw new Error(`Formato inesperado para SLOT/PORT: ${line}`);
    }
    const slotAndPort = columns[FSP_INDEX].split("/");
    if (!slotAndPort[1] || !slotAndPort[2]) {
      throw new Error(
        `Formato inesperado para SLOT/PORT: ${columns[FSP_INDEX]}`
      );
    }
    if (!slotAndPort[1] || !slotAndPort[2] || !columns[ONT_INDEX] || !columns[SN_INDEX] || !columns[STATE_INDEX]) {
      throw new Error(`Dados incompletos na linha: ${line}`);
    }
    return {
      slot: slotAndPort[1],
      port: slotAndPort[2],
      ont: columns[ONT_INDEX],
      sn: columns[SN_INDEX],
      state: columns[STATE_INDEX]
    };
  });
}

// src/utils/parsers/zte-parsers.ts
var SPLIT_REGEX2 = /\s{2,}/;
function isZteOltData(data) {
  const requiredKeywords = ["OnuIndex", "Type", "Mode", "AuthInfo", "State"];
  const normalizedData = data.toLowerCase();
  return requiredKeywords.every(
    (keyword) => normalizedData.includes(keyword.toLowerCase())
  );
}
function parseZteOltData(data) {
  if (!isZteOltData(data)) {
    throw new Error("Os dados fornecidos n\xE3o s\xE3o de uma OLT ZTE.");
  }
  const lines = data.split("\n");
  const firstIndex = lines.findIndex((line) => line.includes("gpon"));
  const lastIndex = lines.slice(firstIndex).findIndex((line) => !line.includes("gpon"));
  const relevantLines = lines.slice(
    firstIndex,
    lastIndex !== -1 ? lastIndex + firstIndex : lines.length
  );
  const trimmedRelevantLines = relevantLines.map((line) => line.trim());
  const FSP_AND_ONT_INDEX = 0;
  const SN_INDEX = 3;
  const STATE_INDEX = 4;
  return trimmedRelevantLines.map((line) => {
    const columns = line.split(SPLIT_REGEX2);
    if (!columns[FSP_AND_ONT_INDEX]) {
      throw new Error(`Formato inesperado para SLOT/PORT/ONT: ${line}`);
    }
    const slotPortAndOnt = columns[FSP_AND_ONT_INDEX].replace(
      "gpon-onu_",
      ""
    ).split(":");
    if (!slotPortAndOnt[0] || !slotPortAndOnt[1]) {
      throw new Error(`Formato inesperado para SLOT/PORT/ONT: ${line}`);
    }
    const slotAndPort = slotPortAndOnt[0].split("/");
    if (!slotAndPort[1] || !slotAndPort[2]) {
      throw new Error(`Formato inesperado para SLOT/PORT: ${line}`);
    }
    if (!columns[SN_INDEX]) {
      throw new Error(`Formato inesperado para SN: ${line}`);
    }
    return {
      slot: slotAndPort[1],
      port: slotAndPort[2],
      ont: slotPortAndOnt[1],
      sn: columns[SN_INDEX].replace("SN:", ""),
      // TODO: Esse state deveria ser retornado já que temos outro arquivo para isso?
      state: columns[STATE_INDEX] === "ready" ? "online" : "offline"
    };
  });
}
var ANY_NUMBER_WITH_SLASH_REGEX2 = /\d+\//;
function isZteStateOltData(data) {
  const requiredKeywords = [
    "OnuIndex",
    "Admin State",
    "OMCC State",
    "Phase State",
    "Channel"
  ];
  const normalizedData = data.toLowerCase();
  return requiredKeywords.every(
    (keyword) => normalizedData.includes(keyword.toLowerCase())
  );
}
function parseZteStateOltData(data) {
  if (!isZteStateOltData(data)) {
    throw new Error("Os dados fornecidos n\xE3o s\xE3o de uma OLT ZTE.");
  }
  const lines = data.split("\n");
  const firstIndex = lines.findIndex(
    (line) => ANY_NUMBER_WITH_SLASH_REGEX2.test(line.slice(0, 5))
  );
  const lastIndex = lines.slice(firstIndex).findIndex((line) => !ANY_NUMBER_WITH_SLASH_REGEX2.test(line.slice(0, 5)));
  const relevantLines = lines.slice(
    firstIndex,
    lastIndex !== -1 ? lastIndex + firstIndex : lines.length
  );
  const trimmedRelevantLines = relevantLines.map((line) => line.trim());
  const FSP_AND_ONT_INDEX = 0;
  const STATE_INDEX = 3;
  return trimmedRelevantLines.map((line) => {
    const columns = line.split(SPLIT_REGEX2);
    if (!columns[FSP_AND_ONT_INDEX]) {
      throw new Error(`Formato inesperado para SLOT/PORT/ONT: ${line}`);
    }
    const slotPortAndOnt = columns[FSP_AND_ONT_INDEX].split(":");
    if (!slotPortAndOnt[0] || !slotPortAndOnt[1]) {
      throw new Error(`Formato inesperado para SLOT/PORT/ONT: ${line}`);
    }
    const slotAndPort = slotPortAndOnt[0].split("/");
    if (!slotAndPort[1] || !slotAndPort[2]) {
      throw new Error(`Formato inesperado para SLOT/PORT: ${line}`);
    }
    return {
      slot: slotAndPort[1],
      port: slotAndPort[2],
      ont: slotPortAndOnt[1],
      state: (() => {
        if (!columns[STATE_INDEX]) {
          return null;
        }
        return columns[STATE_INDEX].toLowerCase() === "working" ? "online" : "offline";
      })()
    };
  });
}

// src/save-olt-data-on-init.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
async function saveOltOnInit() {
  try {
    const huaweiFile = fs.readFileSync(
      __dirname + "/../data/OntInfo - Huawei.txt",
      "utf8"
    );
    const huaweiOltData = parseHuaweiOltData(huaweiFile);
    const zteFile = fs.readFileSync(
      __dirname + "/../data/OntInfo - ZTE - SNs.txt",
      "utf8"
    );
    const zteOltData = parseZteOltData(zteFile);
    const zteStateFile = fs.readFileSync(
      __dirname + "/../data/OntInfo - ZTE - SNs - State.txt",
      "utf8"
    );
    const zteStateOltData = parseZteStateOltData(zteStateFile);
    const allZteData = zteOltData.map((zte) => {
      const stateData = zteStateOltData.find(
        (zteState) => zteState.slot === zte.slot && zteState.port === zte.port && zteState.ont === zte.ont
      );
      if (!stateData?.state) {
        return zte;
      }
      return {
        ...zte,
        state: stateData.state.toLowerCase() === "working" ? "online" : "offline"
      };
    });
    await prisma.oltData.deleteMany();
    await prisma.oltData.createMany({
      data: huaweiOltData.concat(allZteData),
      skipDuplicates: true
    });
    console.log("Dados inseridos na tabela oltData com sucesso.");
  } catch (error) {
    console.error("Erro ao inserir dados na tabela oltData:", error);
  }
}

// src/server.ts
var HOST = process.env.HOST ?? "0.0.0.0";
var PORT = process.env.PORT ? Number(process.env.PORT) : 3333;
saveOltOnInit();
var app = fastify({ logger: true });
app.get("/", () => {
  return { status: "OK" };
});
app.post("/olt-data", async (request, reply) => {
  const body = request.body;
  if (!body || body.length === 0) {
    return reply.status(400).send({ error: "Body \xE9 obrigat\xF3rio" });
  }
  try {
    await prisma.oltData.createMany({
      data: body,
      skipDuplicates: true
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
  const body = request.body;
  if (!body || body.length === 0) {
    return reply.status(400).send({ error: "Body \xE9 obrigat\xF3rio" });
  }
  try {
    await Promise.all(
      body.map((data) => {
        const { id, ...rest } = data;
        const oltDataExists = prisma.oltData.findUnique({ where: { id } });
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
  const body = request.body;
  if (!body || body.ids.length === 0) {
    return reply.status(400).send({ error: "Body \xE9 obrigat\xF3rio" });
  }
  try {
    await prisma.oltData.deleteMany({
      where: {
        id: {
          in: body.ids
        }
      }
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
