import type { IColorValue } from "@tyl/validators/trackable";
import { presetsArray } from "@tyl/helpers/colorPresets";

import { cn } from "~/@shad";
import { ColorDisplay } from "~/components/Colors/colorDisplay";

export const Presets = ({
  setColor,
  className,
}: {
  savedColor: IColorValue;
  setColor: (v: IColorValue) => void;
  className?: string;
}) => {
  return (
    <div className={cn("grid grid-cols-8 gap-1", className)}>
      {presetsArray.map((col, index) => {
        return (
          <button key={index} onClick={() => setColor(col)}>
            <ColorDisplay color={col} />
          </button>
        );
      })}
    </div>
  );
};
