import fs from "fs";

// Todos os dados estão separados por mais de um espaço
const SPLIT_REGEX = /\s{2,}/;

/**
 * Valida se o texto é uma saída de comando ZTE OLT (show gpon onu state).
 * @param {string} data - O conteúdo de texto do arquivo.
 * @returns {boolean} - Retorna true se todas as palavras-chave de cabeçalho forem encontradas.
 */
function isZteOltData(data) {
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
function parseZteOltData(data) {
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

    const slotPortAndOnt = columns[FSP_AND_ONT_INDEX].replace(
      "gpon-onu_",
      ""
    ).split(":");

    const slotAndPort = slotPortAndOnt[0].split("/");

    return {
      slot: slotAndPort[1],
      port: slotAndPort[2],
      ont: slotPortAndOnt[1],
      sn: columns[SN_INDEX].replace("SN:"),
      // TODO: Esse state deveria ser retornado já que temos outro arquivo para isso?
      state: columns[STATE_INDEX] === "ready" ? "online" : "offline",
    };
  });
}

const dataZte = fs.readFileSync("OntInfo - ZTE - SNs.txt", "utf8");

console.log(parseZteOltData(dataZte));

// Regex para identificar linhas que começam com "número/" (exemplo 0/, 1/, etc.)
const ANY_NUMBER_WITH_SLASH_REGEX = /\d+\//;

/** * Valida se o texto é uma saída de comando ZTE OLT (show gpon onu state).
 * @param {string} data - O conteúdo de texto do arquivo.
 * @returns {boolean} - Retorna true se todas as palavras-chave de cabeçalho forem encontradas.
 */
function isZteStateOltData(data) {
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

function parseZteStateOltData(data) {
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

    console.log(columns);

    const slotPortAndOnt = columns[FSP_AND_ONT_INDEX].split(":");

    const slotAndPort = slotPortAndOnt[0].split("/");

    return {
      slot: slotAndPort[1],
      port: slotAndPort[2],
      ont: slotPortAndOnt[1],
      state:
        columns[STATE_INDEX].toLowerCase() === "working" ? "online" : "offline",
    };
  });
}

const dataZteStatus = fs.readFileSync(
  "OntInfo - ZTE - SNs - State.txt",
  "utf8"
);

console.log(parseZteStateOltData(dataZteStatus));
