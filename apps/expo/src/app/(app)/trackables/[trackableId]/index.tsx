import { useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { format, getDaysInMonth, getISODay, startOfMonth } from "date-fns";
import { and, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { RadixIcon } from "radix-ui-react-native-icons";

import DayCellWrapper from "~/app/_components/dayCell";
import { TrackableProvider } from "~/app/_components/trackableProvider";
import { Button } from "~/app/_ui/button";
import { db } from "~/db";
import { trackable } from "~/db/schema";
import { tws } from "~/utils/tw";

const MonthView = ({ date }: { date: Date }) => {
  const d = getDaysInMonth(date);

  const dates = Array(d)
    .fill(0)
    .map((_, i) => i + 1);

  const firstDayDate = startOfMonth(d);
  const prefaceWith = getISODay(firstDayDate) - 1;
  const prepend = Array(prefaceWith).fill(0);
  const { height, width } = useWindowDimensions();

  const w = (width - 32 - 6 * 4) / 7;

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        height: "100%",
        backgroundColor: "red",
        gap: 4,
      }}
    >
      {prepend.map((_, i) => (
        <View style={[tws("w-10")]} key={i}></View>
      ))}
      {dates.map((el) => (
        <View style={{ height: 100, width: w }}>
          <DayCellWrapper
            key={el}
            year={date.getFullYear()}
            month={date.getMonth()}
            day={el}
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
              "absolute bottom-0 w-full py-2 flex flex-row justify-center gap-4",
            ),
          ]}
        >
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
    </>
  );
}
