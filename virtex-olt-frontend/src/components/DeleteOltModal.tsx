import type { JSX } from "react";
import type { OltData } from "../actions";
import { Modal } from "./Modal";

interface DeleteOltModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletingData?: OltData;
  onDelete: (id: number) => void;
}

export function DeleteOltModal({
  isOpen,
  onClose,
  deletingData,
  onDelete,
}: DeleteOltModalProps): JSX.Element | null {
  if (!isOpen || !deletingData) {
    return null;
  }

  return (
    <Modal isOpen={isOpen}>
      <h2 className="font-semibold text-xl">Deletar este item?</h2>

      <div className="flex items-end justify-center p-4 bg-gradient-to-r from-gray-100 to-gray-100/50">
        <div className="flex flex-col max-w-[15%] gap-2">
          <p className="text-center">Slot</p>
          <input
            disabled
            name="slot"
            type="text"
            className="outline h-6 outline-gray-500 rounded w-[90%] text-center disabled:cursor-not-allowed disabled:bg-red-100"
            defaultValue={deletingData.slot ?? ""}
          />
        </div>
        <div className="flex flex-col max-w-[15%] gap-2">
          <p className="text-center">Porta</p>
          <input
            disabled
            name="port"
            type="text"
            className="outline h-6 outline-gray-500 rounded w-[90%] text-center disabled:cursor-not-allowed disabled:bg-red-100"
            defaultValue={deletingData.port ?? ""}
          />
        </div>
        <div className="flex flex-col max-w-[15%] gap-2">
          <p className="text-center">ONT</p>
          <input
            disabled
            name="ont"
            type="text"
            className="outline h-6 outline-gray-500 rounded w-[90%] text-center disabled:cursor-not-allowed disabled:bg-red-100"
            defaultValue={deletingData.ont ?? ""}
          />
        </div>
        <div className="flex flex-col max-w-[35%] gap-2">
          <p className="text-center">Serial Number</p>
          <input
            disabled
            name="sn"
            type="text"
            className="outline h-6 outline-gray-500 rounded w-[90%] text-center disabled:cursor-not-allowed disabled:bg-red-100"
            defaultValue={deletingData.sn ?? ""}
          />
        </div>
        <div className="flex flex-col max-w-[20%] gap-2">
          <p className="text-center">Estado</p>
          <select
            disabled
            name="state"
            defaultValue={(() => {
              if (!deletingData.state) {
                return "online";
              }

              return deletingData.state === "online" ? "online" : "offline";
            })()}
            className="outline h-6 outline-gray-500 rounded font-bold cursor-pointer disabled:cursor-not-allowed disabled:bg-red-100"
          >
            <option value="online" className="font-bold text-green-500">
              Online
            </option>
            <option value="offline" className="font-bold text-red-500">
              Offline
            </option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 justify-end w-full px-4">
        <button
          className=" cursor-pointer rounded w-[100px] py-1 font-semibold border hover:bg-gray-200 transition-colors duration-200"
          type="button"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          className=" cursor-pointer w-[100px] rounded py-1 font-semibold bg-gradient-to-r from-red-500 from-40% to-red-950 text-white hover:opacity-90 transition-colors duration-200"
          onClick={() => onDelete(deletingData.id)}
        >
          Deletar
        </button>
      </div>
    </Modal>
  );
}
