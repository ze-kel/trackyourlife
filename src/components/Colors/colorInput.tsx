import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerMobileTitleContext,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ColorPicker from "@components/Colors";
import { ColorDisplay } from "@components/Colors/colorDisplay";
import { presetsMap } from "@components/Colors/presets";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
} from "@components/Dropdown";
import type { IColorValue } from "@t/trackable";
import { useContext, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

const ColorInput = ({
  value = presetsMap.neutral,
  onChange,
}: {
  value?: IColorValue;
  onChange: (v: IColorValue) => void;
}) => {
  const [color, setColor] = useState(value);

  const isDesktop = useMediaQuery("(min-width:768px)", {
    initializeWithValue: false,
  });

  const mobileTitle = useContext(DrawerMobileTitleContext);

  if (isDesktop) {
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
              className="sm:max-w-md"
            />
          </DropdownContent>
        </Dropdown>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <Drawer>
        <DrawerTrigger className="h-fit cursor-pointer">
          <ColorDisplay color={color} className="w-36" />
        </DrawerTrigger>
        <DrawerContent className="p-4">
          <DrawerHeader>
            {mobileTitle && <DrawerTitle>{mobileTitle}</DrawerTitle>}
          </DrawerHeader>
          <ColorPicker
            value={color}
            onChange={(v) => {
              setColor(v);
              onChange(v);
            }}
            className="sm:max-w-md"
          />
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ColorInput;
