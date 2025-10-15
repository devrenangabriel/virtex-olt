// Todos os dados estão separados por mais de um espaço
const SPLIT_REGEX = /\s{2,}/;

/**
 * Valida se o texto é uma saída de comando ZTE OLT (show gpon onu state).
 * @param {string} data - O conteúdo de texto do arquivo.
 * @returns {boolean} - Retorna true se todas as palavras-chave de cabeçalho forem encontradas.
 */
export function isZteOltData(data: string): boolean {
  const requiredKeywords = ["OnuIndex", "Type", "Mode", "AuthInfo", "State"];

  const normalizedData = data.toLowerCase();

  return requiredKeywords.every((keyword) =>
    normalizedData.includes(keyword.toLowerCase())
  );
}

/**
 *
 * @param {string} data - O conteúdo de texto do arquivo.
 * @returns {Array<{slot: string, port: string, ont: string, sn: string, state: string}>} - Retorna uma lista de objetos com as informações extraídas.
 * @throws {Error} - Lança um erro se os dados não forem de uma OLT ZTE.
 */
function parseZteOltData(data: string): Array<{
  slot: string;
  port: string;
  ont: string;
  sn: string;
  state: string;
}> {
  if (!isZteOltData(data)) {
    throw new Error("Os dados fornecidos não são de uma OLT ZTE.");
  }

  const lines = data.split("\n");

  const firstIndex = lines.findIndex((line) => line.includes("gpon"));
  const lastIndex = lines
    .slice(firstIndex)
    .findIndex((line) => !line.includes("gpon"));

  const relevantLines = lines.slice(
    firstIndex,
    lastIndex !== -1 ? lastIndex + firstIndex : lines.length
  );

  const trimmedRelevantLines = relevantLines.map((line) => line.trim());

  // Posições das colunas que queremos extrair
  const FSP_AND_ONT_INDEX = 0; // SLOT, PORT and ONT
  const SN_INDEX = 3;
  const STATE_INDEX = 4;

  return trimmedRelevantLines.map((line) => {
    const columns = line.split(SPLIT_REGEX);

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
      state: columns[STATE_INDEX] === "ready" ? "online" : "offline",
    };
  });
}

// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const dataZte = fs.readFileSync(
//   __dirname + "/../../../data/OntInfo - ZTE - SNs.txt",
//   "utf8"
// );

// console.log(parseZteOltData(dataZte));

// Regex para identificar linhas que começam com "número/" (exemplo 0/, 1/, etc.)
const ANY_NUMBER_WITH_SLASH_REGEX = /\d+\//;

/** * Valida se o texto é uma saída de comando ZTE OLT (show gpon onu state).
 * @param {string} data - O conteúdo de texto do arquivo.
 * @returns {boolean} - Retorna true se todas as palavras-chave de cabeçalho forem encontradas.
 */
function isZteStateOltData(data: string): boolean {
  const requiredKeywords = [
    "OnuIndex",
    "Admin State",
    "OMCC State",
    "Phase State",
    "Channel",
  ];

  const normalizedData = data.toLowerCase();

  return requiredKeywords.every((keyword) =>
    normalizedData.includes(keyword.toLowerCase())
  );
}

export function parseZteStateOltData(data: string): Array<{
  slot: string;
  port: string;
  ont: string;
  state: string;
}> {
  if (!isZteStateOltData(data)) {
    throw new Error("Os dados fornecidos não são de uma OLT ZTE.");
  }

  const lines = data.split("\n");

  const firstIndex = lines.findIndex((line) =>
    ANY_NUMBER_WITH_SLASH_REGEX.test(line.slice(0, 5))
  );
  const lastIndex = lines
    .slice(firstIndex)
    .findIndex((line) => !ANY_NUMBER_WITH_SLASH_REGEX.test(line.slice(0, 5)));

  const relevantLines = lines.slice(
    firstIndex,
    lastIndex !== -1 ? lastIndex + firstIndex : lines.length
  );

  const trimmedRelevantLines = relevantLines.map((line) => line.trim());

  // Posições das colunas que queremos extrair
  const FSP_AND_ONT_INDEX = 0; // SLOT, PORT and ONT
  const STATE_INDEX = 3;

  return trimmedRelevantLines.map((line) => {
    const columns = line.split(SPLIT_REGEX);

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

    if (!columns[STATE_INDEX]) {
      throw new Error(`Formato inesperado para STATE: ${line}`);
    }

    return {
      slot: slotAndPort[1],
      port: slotAndPort[2],
      ont: slotPortAndOnt[1],
      state:
        columns[STATE_INDEX].toLowerCase() === "working" ? "online" : "offline",
    };
  });
}

// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const dataZteStatus = fs.readFileSync(
//   __dirname + "/../../../data/OntInfo - ZTE - SNs - State.txt",
//   "utf8"
// );

// console.log(parseZteStateOltData(dataZteStatus));
