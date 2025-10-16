export interface OltData {
  id: number;
  slot: string;
  port: string;
  ont: string;
  sn: string;
  state: string | null;
}

export async function getOltData(): Promise<OltData[]> {
  return fetch(`${import.meta.env.VITE_API_BACKEND_URL}/olt-data`).then(
    (response) => {
      if (!response.ok) {
        console.error("Failed to fetch OLT data:", response.statusText);

        throw new Error("Failed to fetch OLT data: " + response.statusText);
      }
      return response.json();
    }
  );
}

export async function createOltData(
  data: Omit<OltData, "id">[]
): Promise<void> {
  await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/olt-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function updateOltData(data: OltData[]): Promise<void> {
  await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/olt-data`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function deleteOltData(data: { ids: number[] }): Promise<void> {
  await fetch(`${import.meta.env.VITE_API_BACKEND_URL}/olt-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
