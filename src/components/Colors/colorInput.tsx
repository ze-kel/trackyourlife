import ColorPicker from "@components/Colors";
import { ColorDisplay } from "@components/Colors/colorDisplay";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
} from "@components/Dropdown";
import type { IColorValue } from "@t/trackable";
import { useState } from "react";

const ColorInput = ({
  value,
  onChange,
}: {
  value: IColorValue;
  onChange: (v: IColorValue) => void;
}) => {
  const [color, setColor] = useState(value);

  return (
    <div className="flex gap-4">
      <Dropdown placement="right">
        <DropdownTrigger className="h-fit cursor-pointer">
          <ColorDisplay color={color} className="w-36" />
        </DropdownTrigger>

        <DropdownContent className="p-4">
          <ColorPicker
            value={color}
            onChange={(v) => {
              setColor(v);
              onChange(v);
            }}
            className="max-w-md"
          />
        </DropdownContent>
      </Dropdown>
    </div>
  );
};

export default ColorInput;
