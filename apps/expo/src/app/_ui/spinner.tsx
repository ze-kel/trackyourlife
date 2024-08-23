import React from "react";
import { Image, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import SpinnerBlack from "@assets/spinner-black.png";
import SpinnerWhite from "@assets/spinner-white.png";

const colors = {
  black: SpinnerBlack,
  white: SpinnerWhite,
};

export type ISpinnerColor = keyof typeof colors;

export default function Spinner({
  width = 50,
  color = "black",
}: {
  width?: number;
  color?: ISpinnerColor;
}) {
  const randomWidth = useSharedValue(0);

  const config = {
    duration: 1000,
    easing: Easing.linear,
  };

  React.useEffect(() => {
    randomWidth.value = withRepeat(withTiming(1, config), 100);
  }, []);

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${randomWidth.value * 360}deg` }],
    };
  });

  return (
    <View className="flex h-full w-full items-center justify-center">
      <Animated.View
        style={[
          {
            transformOrigin: "center center",
            width,
            height: width,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          style,
        ]}
      >
        <Image
          source={colors[color]}
          style={{ width, resizeMode: "contain", display: "flex" }}
        />
      </Animated.View>
    </View>
  );
}
