import type { JSX, ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  children?: ReactNode;
}

export function Modal({ isOpen, children }: ModalProps): JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed flex flex-col items-center justify-center place-self-center inset-0 bg-white text-black py-4 rounded max-w-[530px] gap-4 w-[calc(100dvw-2rem)]">
      {children}
    </div>
  );
}
