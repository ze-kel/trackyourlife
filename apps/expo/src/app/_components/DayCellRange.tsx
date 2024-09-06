import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import {
  Pressable,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  EntryAnimationsValues,
  LayoutAnimation,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { FullWindowOverlay } from "react-native-screens";
import * as Haptics from "expo-haptics";
import { flip, offset, shift, useFloating } from "@floating-ui/react-native";
import { Portal } from "@gorhom/portal";

import { clamp } from "@tyl/helpers";
import { range } from "@tyl/helpers/animation";
import { IRangeSettings } from "@tyl/validators/trackable";

import { useDayCellContextRange } from "~/app/_components/dayCellProvider";
import { tws } from "~/utils/tw";

const SelectorItemSize = 40;
const SelectorItemSizeSelected = 60;

const ENTER_DURATION = 300;

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
            translateX: withTiming(0, {
              duration: ENTER_DURATION,
              easing: Easing.out(Easing.ease),
            }),
          },
          { scale: withTiming(1, { duration: ENTER_DURATION / 2 }) },
        ],
      };
      const initialValues = {
        opacity: 0,
        transform: [{ translateX: SelectorItemSize * distance }, { scale: 0 }],
      };
      return {
        initialValues,
        animations,
      };
    });
  }

  return functions;
};

const ScaledItem = ({
  myIndex,
  size,
  selectedIndex,
  selectedSize,
  selectedScale,
  emoji,
}: {
  myIndex: number;
  selectedIndex: number;
  size: number;
  selectedSize: number;
  selectedScale: number;
  emoji: string;
}) => {
  const myLeft =
    selectedIndex < myIndex
      ? selectedSize + size * Math.max(myIndex - 1, 0)
      : myIndex * size;

  const sv = useSharedValue(selectedIndex === myIndex ? selectedScale : 1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      left: withTiming(myLeft, {
        duration: 200,
      }),
      transform: [{ scale: selectedIndex === myIndex ? selectedScale : 1 }],
    };
  });

  return (
    <Animated.View
      style={[
        tws(
          "w-full h-full rounded-[100px] flex flex-row absolute items-center justify-center ",
          myIndex === selectedIndex ? "bg-green-500" : "",
        ),
        {
          width: size,
          height: size,
          transformOrigin: "left",
        },
        animatedStyles,
      ]}
    >
      <Text
        style={{
          fontSize: size * 0.5,
        }}
      >
        {emoji}
      </Text>
    </Animated.View>
  );
};

const StateSelector = ({
  labels,
  selectedIndex,
  itemSize,
  selectedItemSize,
}: {
  selectedIndex: number;
  labels: IRangeSettings["labels"];
  itemSize: number;
  selectedItemSize: number;
}) => {
  if (!labels) return <></>;

  const enters = makeEnters(labels.length);
  const SI = clamp(selectedIndex, 0, labels.length - 1);

  return (
    <View style={[tws("flex rounded-full")]}>
      <View
        style={[
          tws("bg-neutral-800  rounded-full w-full h-full absolute"),
          {
            height: itemSize,
            width: itemSize * (labels.length - 1) + selectedItemSize,
          },
        ]}
      ></View>
      <View style={[tws("flex flex-row relative")]}>
        {labels?.map((v, i) => {
          return (
            <ScaledItem
              myIndex={i}
              selectedIndex={SI}
              key={i}
              selectedScale={selectedItemSize / itemSize}
              emoji={v.emoji || "❓"}
              selectedSize={selectedItemSize}
              size={itemSize}
            />
          );
        })}
      </View>
    </View>
  );
};

const requiredPadding = 16;

const computePosition = ({
  width,
  x,
  y,
  labelsLength,
}: {
  width: number;
  height: number;
  x: number;
  y: number;
  labelsLength: number;
}) => {
  const desiredWidth =
    SelectorItemSize * labelsLength - 1 + SelectorItemSizeSelected;

  const availableWidth = width - requiredPadding * 2;

  const canFitAllItems = availableWidth >= desiredWidth;

  const realWidth = canFitAllItems ? desiredWidth : availableWidth;

  const itemSize =
    labelsLength > 1
      ? (realWidth - SelectorItemSizeSelected) / (labelsLength - 1)
      : 1;

  const xPos = clamp(
    x - realWidth / 2,
    requiredPadding,
    width - requiredPadding - realWidth,
  );
  const yPos = y - 80;

  return {
    xPos,
    yPos,
    elWidth: realWidth,
    clickX: x,
    clickY: y,
    itemSize,
    selectedItemSize: SelectorItemSizeSelected,
  };
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

  const { width, height } = useWindowDimensions();

  useLayoutEffect(() => {
    setInternalValue(value);
  }, [value]);

  const em = internalValue ? (labelMapping[internalValue] as string) : "❓";

  const [isEditing, setIsEditing] = useState(false);

  const [position, setPosition] = useState(
    computePosition({
      width: width,
      height: height,
      x: 1,
      y: 1,
      labelsLength: 1,
    }),
  );

  const [isCancelled, setIsCancelled] = useState(false);

  const pan = Gesture.Pan()
    .activateAfterLongPress(90)
    .runOnJS(true)
    .onStart((e) => {
      setIsEditing(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      const desW = (labels?.length || 0) * SelectorItemSize;

      setPosition(
        computePosition({
          width,
          height,
          x: e.absoluteX,
          y: e.absoluteY,
          labelsLength: labels?.length || 1,
        }),
      );

      updateIndex(e.absoluteX);
      setIsCancelled(false);
    })
    .onUpdate((e) => {
      const fromStart = e.absoluteX;

      updateIndex(fromStart);
      updateCancelPercentage(e.translationY);
    })
    .onEnd(() => {
      if (!isCancelled && onChange) {
        if (!labels?.[selectedIndex]?.internalKey) {
          return;
        }
        onChange(labels[selectedIndex].internalKey);
      }
    })
    .onFinalize((e) => {
      setIsEditing(false);
    });

  const updateIndex = (absoluteX: number) => {
    const i = Math.floor((absoluteX - position.xPos) / position.itemSize);

    if (i !== selectedIndex) {
      setSelectedIndex(i);
      if (!isCancelled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      }
    }
  };

  const updateCancelPercentage = (moveX: number) => {
    const shouldBeCancelled = range(0, 60, 1, 0, moveX) < 0.5;

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
          "w-full  border-2  flex items-center justify-center border-neutral-200 dark:border-neutral-900",
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
        <Portal hostName="rangePortal">
          <FullWindowOverlay>
            <View
              style={[
                tws("absolute"),
                { left: position.xPos, top: position.yPos },
              ]}
            >
              <StateSelector
                itemSize={position.itemSize}
                selectedItemSize={position.selectedItemSize}
                selectedIndex={selectedIndex}
                labels={labels}
              />
            </View>
          </FullWindowOverlay>
        </Portal>
      )}

      {children}
    </View>
  );
};
