import { ReactNode } from "react";
import { Text, View, ViewStyle } from "react-native";

export const DayCellRange = ({
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
  return <View style={style}>{children}</View>;
};
