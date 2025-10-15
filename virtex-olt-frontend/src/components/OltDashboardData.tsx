import { useQuery } from "@tanstack/react-query";
import { getOltData } from "../actions";

export function OltDashboardData() {
  const query = useQuery({
    queryKey: ["oltData"],
    queryFn: getOltData,
  });

  if (query.isLoading) {
    return <div>Carregando...</div>;
  }

  if (query.isError || !query.data) {
    return <div>Erro ao carregar os dados.</div>;
  }

  return (
    <div className="overflow-x-auto w-full">
      <h1 className="text-2xl font-bold text-center">
        Total: {query.data.length}
      </h1>
      <table className="mx-auto">
        <thead>
          <tr>
            <th className="px-2 py-1 md:px-4 md:py-2">Slot</th>
            <th className="px-2 py-1 md:px-4 md:py-2">Porta</th>
            <th className="px-2 py-1 md:px-4 md:py-2">ONT</th>
            <th className="px-2 py-1 md:px-4 md:py-2">Serial Number</th>
            <th className="px-2 py-1 md:px-4 md:py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {query.data.map((item, index) => (
            <tr key={index} className="text-center">
              <td className="border px-2 py-1 md:px-4 md:py-2">{item.slot}</td>
              <td className="border px-2 py-1 md:px-4 md:py-2">{item.port}</td>
              <td className="border px-2 py-1 md:px-4 md:py-2">{item.ont}</td>
              <td className="border px-2 py-1 md:px-4 md:py-2">{item.sn}</td>
              <td className="border px-2 py-1 md:px-4 md:py-2">
                {item.state === "online" ? (
                  <span className="text-green-500 font-bold">Online</span>
                ) : (
                  <span className="text-red-500 font-bold">Offline</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
