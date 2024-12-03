import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import chroma from "chroma-js";

import type { IColorValue } from "@tyl/validators/trackable";
import { makeColorString } from "@tyl/helpers/colorTools";

import { cn } from "~/@shad/utils";
import ColorInput from "~/components/Colors/colorInput";

export const Route = createFileRoute("/app/testing")({
  component: RouteComponent,
});

function RouteComponent() {
  const [color, setColor] = useState<IColorValue>({
    lightMode: { h: 0, s: 0, l: 0 },
    darkMode: { h: 0, s: 0, l: 0 },
    userSelect: { h: 0, s: 0, l: 0 },
  });

  const darkToWhite = chroma.contrast(
    chroma.hsl(0, 0, 100),
    chroma.hsl(
      color.darkMode.h,
      color.darkMode.s / 100,
      color.darkMode.l / 100,
    ),
  );

  const lightToBlack = chroma.contrast(
    chroma.hsl(0, 0, 0),
    chroma.hsl(
      color.lightMode.h,
      color.lightMode.s / 100,
      color.lightMode.l / 100,
    ),
  );

  return (
    <div>
      <ColorInput value={color} onChange={setColor} />
      <div
        className="flex h-32 w-32 items-center justify-center text-lg text-black"
        style={{ background: makeColorString(color.lightMode) }}
      >
        1337
      </div>
      <div className={cn(lightToBlack < 4.5 && "text-red-500")}>
        {lightToBlack}
      </div>
      <div
        className="flex h-32 w-32 items-center justify-center text-lg text-white"
        style={{ background: makeColorString(color.darkMode) }}
      >
        1337
      </div>
      <div className={cn(darkToWhite < 4.5 && "text-red-500")}>
        {darkToWhite}
      </div>
    </div>
  );
}
