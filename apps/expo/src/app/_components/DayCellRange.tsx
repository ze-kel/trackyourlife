import { ReactNode, useLayoutEffect, useState } from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { clamp } from "@tyl/helpers";
import { range } from "@tyl/helpers/animation";

import { useDayCellContextRange } from "~/app/_components/DayCellProvider";
import { tws } from "~/utils/tw";

const SelectorItemSize = 45;

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
  const { labelMapping, labels, settings } = useDayCellContextRange();

  const [internalValue, setInternalValue] = useState(value);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useLayoutEffect(() => {
    setInternalValue(value);
  }, [value]);

  const em = internalValue ? (labelMapping[internalValue] as string) : "❓";

  const [isEditing, setIsEditing] = useState(false);

  const [cancelPercentage, setCancelPercentage] = useState(0);

  const isCancelled = cancelPercentage < 0.5;

  const pan = Gesture.Pan();

  const updateIndex = (fromStart: number) => {
    const i = Math.floor(fromStart / SelectorItemSize);
    setSelectedIndex(i);
  };

  const updateCancelPercentage = (moveX: number) => {
    setCancelPercentage(range(0, 60, 1, 0, moveX));
  };

  pan.onBegin((e) => {
    setIsEditing(true);
    updateIndex(totalHeight / 2);
    setCancelPercentage(0);
  });

  pan.onEnd((e) => {
    setIsEditing(false);
    if (!isCancelled && onChange) {
      if (!labels?.[selectedIndex]?.internalKey) {
        return;
      }
      onChange(labels[selectedIndex].internalKey);
    }
  });
  pan.onUpdate((e) => {
    const fromStart = e.translationY + totalHeight / 2;

    updateIndex(fromStart);
    updateCancelPercentage(e.translationX);
  });

  const totalHeight = SelectorItemSize * (labels?.length || 0);

  return (
    <View
      style={[
        tws(
          "h-[80px] w-full  border-2  flex items-center justify-center border-neutral-200 dark:border-neutral-900",
        ),
        style,
      ]}
    >
      <GestureDetector gesture={pan}>
        <Pressable>
          <Text style={tws("text-2xl")}>{em}</Text>
        </Pressable>
      </GestureDetector>

      {isEditing && (
        <View
          style={[
            tws(
              "absolute left-1 z-20 flex flex-col bg-neutral-800 rounded-[100px]",
            ),
            { top: 40 - totalHeight / 2 },
            { opacity: cancelPercentage },
          ]}
        >
          {labels?.map((v, i) => {
            return (
              <Pressable key={v.id}>
                <View
                  style={[
                    tws(
                      "w-full h-full rounded-[100px] flex items-center justify-center",
                      i === selectedIndex && "bg-green-500",
                    ),
                    { width: SelectorItemSize, height: SelectorItemSize },
                  ]}
                >
                  <Text style={tws("text-lg")}>{v.emoji}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}

      {children}
    </View>
  );
};
