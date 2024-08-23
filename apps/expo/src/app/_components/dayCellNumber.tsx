import { ReactNode, useState } from "react";
import { TextInput, View } from "react-native";

import { useDayCellContextNumber } from "~/app/_components/dayCellProvider";

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
  className,
}: {
  value?: string;
  onChange?: (v: string) => Promise<void> | void;
  children: ReactNode;
  dateDay: Date;
  className?: string;
}) => {
  const { valueToColor, valueToProgressPercentage } = useDayCellContextNumber();

  const [internalNumber, setInternalNumber] = useState(getNumberSafe(value));
  const [rawInput, setRawInput] = useState<string>(String(internalNumber));

  const [isEditing, setIsEditing] = useState(false);

  return (
    <View>
      <TextInput keyboardType="numeric" />
    </View>
  );
};
