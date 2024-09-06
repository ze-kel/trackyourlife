import { useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import {
  add,
  eachMonthOfInterval,
  format,
  getDaysInMonth,
  getISODay,
  isAfter,
  startOfMonth,
  sub,
} from "date-fns";
import { and, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { RadixIcon } from "radix-ui-react-native-icons";

import DayCellWrapper from "~/app/_components/dayCell";
import { TrackableProvider } from "~/app/_components/trackableProvider";
import { Button } from "~/app/_ui/button";
import { db } from "~/db";
import { trackable } from "~/db/schema";
import { tws } from "~/utils/tw";

export const CustomDateController = () => {
  const nd = new Date();
  const [date, setDate] = useState(startOfMonth(new Date()));
  const { height, width } = useWindowDimensions();

  const pan = Gesture.Pan()
    .onChange((v) => {
      fromLeft.value = fromLeft.value + v.changeX;
    })
    .runOnJS(true);

  const visible = eachMonthOfInterval({
    start: sub(date, { months: 10 }),
    end: add(date, { months: 10 }),
  });

  const itemW = 40;

  const totalW = visible.length * itemW;

  const fromLeft = useSharedValue(-totalW / 2 + width / 2);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: fromLeft.value }],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <View
        style={[
          tws("flex flex-col justify-center items-center relative"),
          { width },
        ]}
      >
        <View
          style={[tws("bg-red-500 w-0.5 h-6 absolute left-1/2 -top-4")]}
        ></View>
        <Animated.View
          style={[tws("flex flex-row absolute left-0 gap-0"), animatedStyles]}
        >
          {visible.map((v, i) => {
            return (
              <View
                key={i}
                style={[
                  tws(
                    "flex flex-col items-center justify-center",
                    isAfter(v, nd) ? "opacity-20" : "",
                  ),
                  { width: itemW },
                ]}
              >
                <Text style={[tws("text-color-base font-bold text-center ")]}>
                  {format(v, "MMM")}
                </Text>
                <Text
                  style={[
                    tws("text-color-base font-light text-center w-10 text-xs"),
                  ]}
                  key={i}
                >
                  {format(v, "yy")}
                </Text>
                <Text
                  style={[
                    tws("text-color-base font-light text-center w-10 text-xs"),
                  ]}
                  key={i}
                >
                  {i}
                </Text>
              </View>
            );
          })}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

//{i + 1}/{visible.length}
const MonthView = ({ date }: { date: Date }) => {
  const d = getDaysInMonth(date);

  const dates = Array(d)
    .fill(0)
    .map((_, i) => i + 1);

  const firstDayDate = startOfMonth(d);
  const prefaceWith = getISODay(firstDayDate) - 1;
  const prepend = Array(prefaceWith).fill(0);
  const { height, width } = useWindowDimensions();

  const p = 8;
  const gap = 2;
  const w = (width - p * 2 - 6 * gap) / 7;
  const h = 70;

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        width: width,
        height: 300,
        gap: gap,
        padding: p,
      }}
    >
      {prepend.map((_, i) => (
        <View style={[tws(""), { width: w }]} key={i}></View>
      ))}
      {dates.map((el) => (
        <View key={el} style={{ width: w }}>
          <DayCellWrapper
            key={el}
            year={date.getFullYear()}
            month={date.getMonth()}
            day={el}
            size="s"
            style={{ height: h - 20 }}
            styleWrapper={{ height: h }}
            labelType={"outside"}
          />
        </View>
      ))}
    </View>
  );
};

export default function Index() {
  const { trackableId } = useLocalSearchParams<{ trackableId: string }>();

  const { data } = useLiveQuery(
    db.query.trackable.findFirst({
      where: and(eq(trackable.isDeleted, false), eq(trackable.id, trackableId)),
    }),
  );

  const [currentDate, setDate] = useState(new Date(2024, 7, 1));

  if (!data) {
    return (
      <View>
        <Text>aaa</Text>
      </View>
    );
  }

  return (
    <>
      <View style={[tws("relative h-full w-full z-20")]}>
        <SafeAreaView edges={["top"]} />
        <TrackableProvider trackable={data}>
          <MonthView date={currentDate} />
        </TrackableProvider>

        <View
          style={[
            tws(
              "absolute bottom-0 w-full py-2 flex flex-col justify-center gap-4",
            ),
          ]}
        >
          <CustomDateController />

          <View style={[tws("w-full py-2 flex flex-row justify-center gap-4")]}>
            <View style={[tws(" flex flex-row gap-2 items-center")]}>
              <Button variant={"outline"}>{currentDate.getFullYear()}</Button>
              <Button variant={"outline"}>{format(currentDate, "MMMM")}</Button>
            </View>

            <Button
              variant={"ghost"}
              leftIcon={
                <RadixIcon name="double-arrow-right" color="white" size={14} />
              }
            >
              Today
            </Button>
          </View>
        </View>
      </View>
    </>
  );
}
