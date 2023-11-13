import ColorPicker from "@components/_UI/ColorPicker";
import { ColorDisplay } from "@components/_UI/ColorPicker/presetsPanel";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
} from "@components/_UI/Dropdown";
import type { IColorValue } from "@t/trackable";

const ColorInput = ({
  value,
  onChange,
}: {
  value: IColorValue;
  onChange: (v: IColorValue) => void;
}) => {
  return (
    <div className="flex gap-4">
      <Dropdown placement="right">
        <DropdownTrigger className="h-fit cursor-pointer">
          <ColorDisplay color={value} className="w-36" />
        </DropdownTrigger>

        <DropdownContent className="p-4">
          <ColorPicker value={value} onChange={onChange} className="max-w-md" />
        </DropdownContent>
      </Dropdown>
    </div>
  );
};

export default ColorInput;
