import { ReactNode, useLayoutEffect, useState } from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  EntryAnimationsValues,
  ExitAnimationsValues,
  LayoutAnimation,
  withTiming,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { opacity } from "react-native-reanimated/lib/typescript/reanimated2/Colors";
import * as Haptics from "expo-haptics";

import { range } from "@tyl/helpers/animation";
import { IRangeSettings } from "@tyl/validators/trackable";

import { useDayCellContextRange } from "~/app/_components/DayCellProvider";
import { tws } from "~/utils/tw";

const SelectorItemSize = 45;

const ENTER_DURATION = 300;

const customEnteringBG = (values: EntryAnimationsValues): LayoutAnimation => {
  "worklet";
  const animations = {
    transform: [
      { scaleY: withTiming(1, { duration: ENTER_DURATION }) },
      { translateY: withTiming(0, { duration: ENTER_DURATION }) },
    ],
  };
  const initialValues = {
    transform: [{ scaleY: 0 }, { translateY: values.targetHeight / -2 }],
  };
  return {
    initialValues,
    animations,
  };
};

const makeEnters = (labelsLength: number) => {
  const functions: Array<(v: EntryAnimationsValues) => LayoutAnimation> = [];

  const center = (labelsLength - 1) / 2;

  for (let i = 0; i < labelsLength; i++) {
    const distance = center - i;

    functions.push((v) => {
      "worklet";
      const animations = {
        opacity: withTiming(1, { duration: ENTER_DURATION }),
        transform: [
          {
            translateY: withTiming(0, {
              duration: ENTER_DURATION,
              easing: Easing.out(Easing.ease),
            }),
          },
          { scale: withTiming(1, { duration: ENTER_DURATION / 2 }) },
        ],
      };
      const initialValues = {
        opacity: 0,
        transform: [{ translateY: SelectorItemSize * distance }, { scale: 0 }],
      };
      return {
        initialValues,
        animations,
      };
    });
  }

  return functions;
};

const StateSelector = ({
  labels,
  selectedIndex,
}: {
  selectedIndex: number;
  labels: IRangeSettings["labels"];
}) => {
  if (!labels) return <></>;
  const totalHeight = SelectorItemSize * (labels?.length || 0);

  const enters = makeEnters(labels.length);

  return (
    <Animated.View
      style={[
        tws("absolute z-100 left-1 flex flex-col rounded-full"),
        { top: 40 - totalHeight / 2 },
      ]}
    >
      <Animated.View
        entering={customEnteringBG}
        style={[tws("bg-neutral-800 rounded-full w-full h-full absolute")]}
      ></Animated.View>
      <Animated.View>
        {labels?.map((v, i) => {
          return (
            <Animated.View
              key={v.id}
              entering={enters[i]}
              style={[
                tws(
                  "w-full h-full rounded-[100px] flex items-center justify-center ",
                  i === selectedIndex && "bg-green-500",
                ),
                {
                  width: SelectorItemSize,
                  height: SelectorItemSize,
                  zIndex: i === 2 ? 0 : 40,
                },
              ]}
            >
              <Text style={tws("text-lg")}>{v.emoji}</Text>
            </Animated.View>
          );
        })}
      </Animated.View>
    </Animated.View>
  );
};

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

  const [isCancelled, setIsCancelled] = useState(false);

  const pan = Gesture.Pan().activateAfterLongPress(90);
  const totalHeight = SelectorItemSize * (labels?.length || 0);

  pan.onStart((e) => {
    setIsEditing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    console.log(e.x, e.y);

    updateIndex(totalHeight / 2);
    setIsCancelled(false);
  });

  pan.onUpdate((e) => {
    const fromStart = e.translationY + totalHeight / 2;

    updateIndex(fromStart);
    updateCancelPercentage(e.translationX);
  });

  pan.onEnd(() => {
    if (!isCancelled && onChange) {
      if (!labels?.[selectedIndex]?.internalKey) {
        return;
      }
      onChange(labels[selectedIndex].internalKey);
    }
  });

  pan.onFinalize((e) => {
    setIsEditing(false);
  });

  const updateIndex = (fromStart: number) => {
    const i = Math.floor(fromStart / SelectorItemSize);
    if (i !== selectedIndex) {
      setSelectedIndex(i);
      if (!isCancelled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      }
    }
  };

  const updateCancelPercentage = (moveX: number) => {
    const shouldBeCancelled = range(0, 60, 1, 0, moveX) < 0.5;

    console.log(shouldBeCancelled, isCancelled);

    if (shouldBeCancelled && !isCancelled) {
      setIsCancelled(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (!shouldBeCancelled && isCancelled) {
      setIsCancelled(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

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
        <Pressable
          style={[tws("w-full h-full flex items-center justify-center")]}
        >
          {internalValue && <Text style={tws("text-2xl")}>{em}</Text>}
        </Pressable>
      </GestureDetector>

      {isEditing && !isCancelled && (
        <StateSelector selectedIndex={selectedIndex} labels={labels} />
      )}

      {children}
    </View>
  );
};
