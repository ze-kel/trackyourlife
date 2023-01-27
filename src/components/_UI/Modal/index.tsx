import type { ReactNode } from "react";
import ModalPortal from "./ModalPortal";

interface ModalProps {
  children: ReactNode;
  close: () => void;
}

const Modal = ({ children, close }: ModalProps) => {
  return (
    <ModalPortal>
      <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center">
        <div className="absolute z-50 w-[500px] max-w-full rounded-md border bg-neutral-50 p-8 opacity-100 dark:border-neutral-700 dark:bg-neutral-900">
          {children}
        </div>
      </div>
      <div
        className="absolute top-0 left-0 z-40 h-full w-full bg-neutral-900 opacity-50"
        onClick={close}
      ></div>
    </ModalPortal>
  );
};

export default Modal;
