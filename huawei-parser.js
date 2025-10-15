import fs from "fs";

// Regex para identificar linhas que começam com "número/" (exemplo 0/, 1/, etc.)
const ANY_NUMBER_WITH_SLASH_REGEX = /\d+\//;

// Todos os dados estão separados por mais de um espaço
const SPLIT_REGEX = /\s{2,}/;

/**
 * Valida se o texto é uma saída de comando Huawei OLT (display ont info).
 * @param {string} data - O conteúdo de texto do arquivo.
 * @returns {boolean} - Retorna true se todas as palavras-chave de cabeçalho forem encontradas.
 */
function isHuaweiOltData(data) {
  const requiredKeywords = ["F/S/P", "ONT", "SN", "Run", "state"];

  const normalizedData = data.toLowerCase();

  return requiredKeywords.every((keyword) =>
    normalizedData.includes(keyword.toLowerCase())
  );
}

/**
 * Extrai informações de OLT Huawei do texto fornecido.
 * @param {string} data - O conteúdo de texto do arquivo.
 * @returns {Array<{slot: string, port: string, ont: string, sn: string, state: string}>} - Retorna uma lista de objetos com as informações extraídas.
 * @throws {Error} - Lança um erro se os dados não forem de uma OLT Huawei.
 */
function parseHuaweiOltData(data) {
  if (!isHuaweiOltData(data)) {
    throw new Error("Os dados fornecidos não são de uma OLT Huawei.");
  }

  const lines = data.split("\n");

  // Encontrar o primeiro índice de "número/" (exemplo 0/) e o último índice de "número/"
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
  const FSP_INDEX = 0; // SLOT and PORT
  const ONT_INDEX = 1;
  const SN_INDEX = 2;
  const STATE_INDEX = 4;

  return trimmedRelevantLines.map((line) => {
    const columns = line.split(SPLIT_REGEX);

    const slotAndPort = columns[FSP_INDEX].split("/");

    return {
      slot: slotAndPort[1],
      port: slotAndPort[2],
      ont: columns[ONT_INDEX],
      sn: columns[SN_INDEX],
      state: columns[STATE_INDEX],
    };
  });
}

const data = fs.readFileSync("OntInfo - Huawei.txt", "utf8");

console.log(parseHuaweiOltData(data));
