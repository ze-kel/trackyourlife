import { ReactNode, useState } from "react";
import { Pressable, TextInput, View, ViewStyle } from "react-native";

import { useDayCellContextNumber } from "~/app/_components/DayCellProvider";
import { tws } from "~/utils/tw";

const getNumberSafe = (v: string | undefined) => {
  if (!v) return 0;
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
};

export const NumberFormatter = new Intl.NumberFormat("en-US", {
  compactDisplay: "short",
  notation: "compact",
});

export const DayCellNumber = ({
  value,
  onChange,
  children,
  dateDay,
  style,
}: {
  value?: string;
  onChange?: (v: string) => Promise<void> | void;
  children?: ReactNode;
  dateDay: Date;
  style?: ViewStyle;
}) => {
  const { valueToColor, valueToProgressPercentage } = useDayCellContextNumber();

  const [internalNumber, setInternalNumber] = useState(getNumberSafe(value));
  const [rawInput, setRawInput] = useState<string>(String(internalNumber));

  const [isEditing, setIsEditing] = useState(false);

  return (
    <Pressable style={[tws("h-[80px] bg-red-500"), style]}>
      <TextInput keyboardType="numeric" />
    </Pressable>
  );
};
