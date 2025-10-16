import type { JSX } from "react";
import type { OltData } from "../actions";
import { Modal } from "./Modal";

interface OltModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingData?: OltData;
  onConfirm: (data: Omit<OltData, "id"> & { id: number | undefined }) => void;
}

export function OltModal({
  isOpen,
  onClose,
  editingData,
  onConfirm,
}: OltModalProps): JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <Modal isOpen={isOpen}>
      <h2 className="font-semibold text-xl">
        {editingData ? "Edição" : "Criação"}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);

          const data: Omit<OltData, "id"> & { id: number | undefined } = {
            slot: String(formData.get("slot")),
            port: String(formData.get("port")),
            ont: String(formData.get("ont")),
            sn: String(formData.get("sn")),
            state: String(formData.get("state")),
            id: undefined,
          };

          if (editingData?.id) {
            data.id = editingData.id;
          }

          onConfirm(data);
          onClose();
        }}
        className="flex flex-col gap-4 items-center"
      >
        <div className="flex items-end justify-center p-4 bg-gradient-to-r from-gray-200 to-gray-200/50">
          <div className="flex flex-col max-w-[15%] gap-2">
            <p className="text-center">Slot</p>
            <input
              name="slot"
              type="text"
              className="outline h-6 outline-gray-500 rounded w-[90%] text-center"
              defaultValue={editingData?.slot ?? ""}
            />
          </div>
          <div className="flex flex-col max-w-[15%] gap-2">
            <p className="text-center">Porta</p>
            <input
              name="port"
              type="text"
              className="outline h-6 outline-gray-500 rounded w-[90%] text-center"
              defaultValue={editingData?.port ?? ""}
            />
          </div>
          <div className="flex flex-col max-w-[15%] gap-2">
            <p className="text-center">ONT</p>
            <input
              name="ont"
              type="text"
              className="outline h-6 outline-gray-500 rounded w-[90%] text-center"
              defaultValue={editingData?.ont ?? ""}
            />
          </div>
          <div className="flex flex-col max-w-[35%] gap-2">
            <p className="text-center">Serial Number</p>
            <input
              name="sn"
              type="text"
              className="outline h-6 outline-gray-500 rounded w-[90%] text-center"
              defaultValue={editingData?.sn ?? ""}
            />
          </div>
          <div className="flex flex-col max-w-[20%] gap-2">
            <p className="text-center">Estado</p>
            <select
              name="state"
              defaultValue={(() => {
                if (!editingData?.state) {
                  return "online";
                }

                return editingData?.state === "online" ? "online" : "offline";
              })()}
              className="outline h-6 outline-gray-500 rounded font-bold cursor-pointer"
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
            className=" cursor-pointer rounded w-[100px] py-1 font-semibold border hover:bg-gray-200 transition-colors"
            type="button"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className=" cursor-pointer bg-red-500 w-[100px] rounded py-1 text-white font-semibold hover:bg-red-600 transition-colors"
            type="submit"
          >
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  );
}
