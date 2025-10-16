import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOltData,
  deleteOltData,
  getOltData,
  updateOltData,
  type OltData,
} from "../actions";
import { useState, type JSX } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { OltModal } from "./OltModal";
import { DeleteOltModal } from "./DeleteOltModal";

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
  onDelete: (oltData: OltData) => void;
}

function BodyRow({
  id,
  slot,
  port,
  ont,
  sn,
  state,
  onEdit,
  onDelete,
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
          onClick={() => onEdit({ id, slot, port, ont, sn, state })}
          className={`${DEFAULT_CELL_STYLE} reverse cursor-pointer transition-colors hover:bg-gradient-to-tl hover:from-white/10 duration-200`}
        >
          <Pencil />
        </button>
      </td>
      <td>
        <button
          onClick={() => onDelete({ id, slot, port, ont, sn, state })}
          className={`${DEFAULT_CELL_STYLE} cursor-pointer transition-colors hover:bg-gradient-to-tl hover:from-white/10 duration-200`}
        >
          <Trash2 />
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

  const [isDeletOltModalOpen, setIsDeleteOltModalOpen] =
    useState<boolean>(false);

  const [deletingData, setDeletingData] = useState<OltData | undefined>(
    undefined
  );

  const query = useQuery({
    queryKey: ["oltData"],
    queryFn: getOltData,
  });

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createOltData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["oltData"] });

      alert("Dado criada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar dado:", error);
      alert("Erro ao atualizar dados.");
    },
  });

  const updateMutation = useMutation({
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

  const deleteMutation = useMutation({
    mutationFn: deleteOltData,
    onSuccess: (_data, variables: { ids: number[] }) => {
      queryClient.setQueryData(["oltData"], (oldData?: OltData[]) => {
        if (!oldData || !Array.isArray(oldData)) return oldData;

        return oldData.filter((item) => !variables.ids.includes(item.id));
      });

      alert("Dados deletados com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao deletar dados:", error);
      alert("Erro ao deletar dados.");
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
                setIsDeleteOltModalOpen(false);
                setDeletingData(undefined);
                setEditingData(data);
                setIsOltModalOpen(true);
              }}
              onDelete={(data) => {
                setIsOltModalOpen(false);
                setEditingData(undefined);
                setDeletingData(data);
                setIsDeleteOltModalOpen(true);
              }}
            />
          ))}
        </tbody>
      </table>

      <div className="fixed top-32 flex w-full pointer-events-none">
        <div className="mx-auto flex w-full max-w-[698px] justify-end px-4 lg:px-0">
          <button
            className="cursor-pointer flex justify-center items-center bg-red-500 h-16 w-16 rounded-full text-white border pointer-events-auto transition-colors duration-200 hover:bg-red-600"
            onClick={() => {
              setEditingData(undefined);
              setIsOltModalOpen(true);
            }}
          >
            <Plus />
          </button>
        </div>
      </div>

      <OltModal
        isOpen={isOltModalOpen}
        onClose={() => {
          setIsOltModalOpen(false);
        }}
        onConfirm={(
          oltData: Omit<OltData, "id"> & { id: number | undefined }
        ) => {
          if (oltData.id) {
            updateMutation.mutate([{ ...(oltData as OltData) }]);
          } else {
            createMutation.mutate([oltData]);
          }

          setIsOltModalOpen(false);
          setEditingData(undefined);
        }}
        editingData={editingData}
      />

      <DeleteOltModal
        isOpen={isDeletOltModalOpen}
        onClose={() => {
          setIsDeleteOltModalOpen(false);
          setDeletingData(undefined);
        }}
        deletingData={deletingData}
        onDelete={(id) => {
          deleteMutation.mutate({ ids: [id] });
          setIsDeleteOltModalOpen(false);
          setDeletingData(undefined);
        }}
      />
    </div>
  );
}
