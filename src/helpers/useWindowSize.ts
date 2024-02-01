import { useState } from "react";
import { useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
}

// Corresponds to sm in tailwind
export const MOBILE_BREAKPOINT = 640;

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleSize();
    addEventListener("resize", handleSize);

    return () => {
      removeEventListener("resize", handleSize);
    };
  }, []);

  return windowSize;
}
