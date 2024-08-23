import { ReactNode, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";
import { useColorScheme } from "nativewind";

import { useDayCellContextBoolean } from "~/app/_components/dayCellProvider";

const CustomIN = ZoomIn.duration(300).easing(Easing.out(Easing.cubic));

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
  const [animateFrom, setAnimateFrom] = useState({ x: 1, y: 1, real: false });

  const {
    themeActiveDark,
    themeActiveLight,
    themeInactiveDark,
    themeInactiveLight,
  } = useDayCellContextBoolean();
  const isActive = value === "true";

  const { colorScheme } = useColorScheme();

  const [colorActive, colorInactive] =
    colorScheme === "dark"
      ? [themeActiveDark, themeInactiveDark]
      : [themeActiveLight, themeInactiveLight];

  const animatedBorder = useAnimatedStyle(() => {
    return {
      borderColor: withTiming(isActive ? colorInactive : colorActive, {
        duration: 300,
      }),
    };
  });

  return (
    <Animated.View style={[{ borderWidth: 2 }, animatedBorder]}>
      <Pressable
        style={{
          position: "relative",
          width: 120,
          height: 80,
          backgroundColor: isActive ? colorInactive : colorActive,
        }}
        onPress={(e) => {
          setAnimateFrom({
            x: Math.round(e.nativeEvent.locationX),
            y: Math.round(e.nativeEvent.locationY),
            real: true,
          });
          if (onChange) {
            onChange(isActive ? "false" : "true");
          }
        }}
      >
        <Animated.View
          key={isActive ? "active" : "inactive"}
          entering={CustomIN}
          style={[
            {
              height: "100%",
              width: "100%",
              position: "absolute",
              left: 0,
              top: 0,
              transformOrigin: animateFrom.real
                ? `${animateFrom.x}px ${animateFrom.y}px`
                : "50% 50%",
              backgroundColor: isActive ? colorActive : colorInactive,
            },
          ]}
        />
        {children}
      </Pressable>
    </Animated.View>
  );
};
