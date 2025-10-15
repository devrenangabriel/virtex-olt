import fs from "fs";
import path from "path";
import { parseHuaweiOltData } from "./utils/parsers/huawei-parser.js";
import { prisma } from "./lib/prisma.js";
import {
  parseZteOltData,
  parseZteStateOltData,
} from "./utils/parsers/zte-parsers.js";

function getDataPath(filename: string): string {
  return path.resolve(process.cwd(), "data", filename);
}

export async function saveOltDataOnInit(): Promise<void> {
  try {
    const huaweiFile = fs.readFileSync(
      getDataPath("OntInfo - Huawei.txt"),
      "utf8"
    );

    const huaweiOltData = parseHuaweiOltData(huaweiFile);

    const zteFile = fs.readFileSync(
      getDataPath("OntInfo - ZTE - SNs.txt"),
      "utf8"
    );

    const zteOltData = parseZteOltData(zteFile);

    const zteStateFile = fs.readFileSync(
      getDataPath("OntInfo - ZTE - SNs - State.txt"),
      "utf8"
    );

    const zteStateOltData = parseZteStateOltData(zteStateFile);

    const allZteData = zteOltData.map((zte) => {
      const stateData = zteStateOltData.find(
        (zteState) =>
          zteState.slot === zte.slot &&
          zteState.port === zte.port &&
          zteState.ont === zte.ont
      );

      if (!stateData?.state) {
        return zte;
      }

      return {
        ...zte,
        state:
          stateData.state.toLowerCase() === "working" ? "online" : "offline",
      };
    });

    await prisma.oltData.deleteMany();

    await prisma.oltData.createMany({
      data: huaweiOltData.concat(allZteData),
      skipDuplicates: true,
    });

    console.log("Dados inseridos na tabela oltData com sucesso.");
  } catch (error) {
    console.error("Erro ao inserir dados na tabela oltData:", error);
  }
}
