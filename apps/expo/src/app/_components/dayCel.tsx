import { ReactNode } from "react";
import { Pressable } from "react-native";

export const DayCellBoolean = ({
  value,
  onChange,
  children,
  className,
}: {
  value?: string;
  onChange?: (v: string) => Promise<void> | void;
  children: ReactNode;
  className?: string;
}) => {
  const isActive = value === "true";


  return <Pressable>



    
  </Pressable>

};
