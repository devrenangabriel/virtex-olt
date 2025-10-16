import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOltData, updateOltData, type OltData } from "../actions";
import { useState, type JSX } from "react";
import { Pencil } from "lucide-react";
import { OltModal } from "./OltModal";

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

interface BodyRowProps {
  id: number;
  slot: string;
  port: string;
  ont: string;
  sn: string;
  state: string | null;
  onEdit: (oltData: OltData) => void;
}

function BodyRow({
  id,
  slot,
  port,
  ont,
  sn,
  state,
  onEdit,
}: BodyRowProps): JSX.Element {
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
      <td>
        <button
          onClick={() => onEdit({ id, slot, port, ont, sn, state })} // id is a placeholder
          className={`${DEFAULT_CELL_STYLE} text-2xl reverse cursor-pointer transition-colors hover:bg-gradient-to-tl hover:from-white/10 duration-200`}
        >
          <Pencil />
        </button>
      </td>
    </tr>
  );
}

export function OltDashboardData(): JSX.Element {
  const [isOltModalOpen, setIsOltModalOpen] = useState<boolean>(false);

  const [editingData, setEditingData] = useState<OltData | undefined>(
    undefined
  );

  const query = useQuery({
    queryKey: ["oltData"],
    queryFn: getOltData,
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateOltData,
    onSuccess: (_data, variables: OltData[]) => {
      queryClient.setQueryData(["oltData"], (oldData?: OltData[]) => {
        if (!oldData || !Array.isArray(oldData)) return oldData;

        return oldData.map((item) => {
          const updatedItem = variables.find((v) => v.id === item.id);
          return updatedItem ? { ...item, ...updatedItem } : item;
        });
      });

      alert("Dados atualizados com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar dados:", error);
      alert("Erro ao atualizar dados.");
    },
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
            <BodyRow
              key={item.id}
              id={item.id}
              slot={item.slot}
              port={item.port}
              ont={item.ont}
              sn={item.sn}
              state={item.state}
              onEdit={(data) => {
                setEditingData(data);
                setIsOltModalOpen(true);
              }}
            />
          ))}
        </tbody>
      </table>

      <OltModal
        isOpen={isOltModalOpen}
        onClose={() => {
          setIsOltModalOpen(false);
        }}
        onSave={(oltData: Omit<OltData, "id"> & { id: number | undefined }) => {
          if (oltData.id) {
            mutation.mutate([{ ...(oltData as OltData) }]);
          }
          setIsOltModalOpen(false);
          setEditingData(undefined);
        }}
        editingData={editingData}
      />
    </div>
  );
}
