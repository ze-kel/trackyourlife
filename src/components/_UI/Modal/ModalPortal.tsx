import type { ReactNode} from "react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const ModalPortal = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  const el = document.querySelector("#modal-portal");
  if (!el) throw new Error("No element for modal portal found");

  return mounted ? createPortal(children, el) : null;
};

export default ModalPortal;
