import type { ReactNode } from "react";
import { LazyMotion } from "framer-motion";

const loadFeatures = () =>
  import("./lazyFramerMotion").then((res) => res.default);

export function LazyMotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
}
