import { useQuery } from "@tanstack/react-query";
import { getOltData } from "../actions";
import type { JSX } from "react";

const DEFAULT_CELL_STYLE = "px-2 py-1 md:px-4 md:py-2";

function HeaderCell({ children }: { children: string }): JSX.Element {
  return <th className={DEFAULT_CELL_STYLE}>{children}</th>;
}

function BodyCell({
  children,
}: {
  children: string | JSX.Element;
}): JSX.Element {
  return <td className={`${DEFAULT_CELL_STYLE} border`}>{children}</td>;
}

interface EditableRowProps {
  id: number;
  slot: string;
  port: string;
  ont: string;
  sn: string;
  state: string | null;
}

function EditableRow({
  id,
  slot,
  port,
  ont,
  sn,
  state,
}: EditableRowProps): JSX.Element {
  return (
    <tr className="text-center">
      <BodyCell>{slot}</BodyCell>
      <BodyCell>{port}</BodyCell>
      <BodyCell>{ont}</BodyCell>
      <BodyCell>{sn}</BodyCell>
      <BodyCell>
        {state === "online" ? (
          <span className="text-green-500 font-bold">Online</span>
        ) : (
          <span className="text-red-500 font-bold">Offline</span>
        )}
      </BodyCell>
    </tr>
  );
}

export function OltDashboardData(): JSX.Element {
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
            <HeaderCell>Slot</HeaderCell>
            <HeaderCell>Porta</HeaderCell>
            <HeaderCell>ONT</HeaderCell>
            <HeaderCell>Serial Number</HeaderCell>
            <HeaderCell>Estado</HeaderCell>
          </tr>
        </thead>
        <tbody>
          {query.data.map((item) => (
            <EditableRow
              id={item.id}
              slot={item.slot}
              port={item.port}
              ont={item.ont}
              sn={item.sn}
              state={item.state}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
