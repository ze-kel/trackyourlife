import { Fragment, useState } from "react";
import {
  ScrollView,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { eachDayOfInterval, format, sub } from "date-fns";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { chunk } from "@tyl/helpers";
import { ZTrackableSettings } from "@tyl/validators/trackable";

import DayCellWrapper from "~/app/_components/dayCell";
import { TrackableProvider } from "~/app/_components/trackableProvider";
import { Button } from "~/app/_ui/button";
import { db } from "~/db";
import { tws } from "~/utils/tw";

export const makeTrackableSettings = (trackable: unknown) => {
  const parseRes = ZTrackableSettings.safeParse(trackable);
  if (parseRes.success) {
    return parseRes.data;
  }
  return {};
};

const Today = () => {
  const now = new Date();
  return (
    <DayCellWrapper
      day={now.getDate()}
      month={now.getMonth()}
      year={now.getFullYear()}
    ></DayCellWrapper>
  );
};

const DateView = ({ date }: { date: Date }) => {
  const { data } = useLiveQuery(db.query.trackable.findMany());
  const { height, width } = useWindowDimensions();

  const columns = chunk(data, Math.ceil(data.length / 2));

  return (
    <>
      <SafeAreaView edges={["top"]} />
      <View
        style={[
          tws(
            "px-4 flex flex-row items-center justify-between pb-2 overflow-hidden",
          ),
          { width: width },
        ]}
      >
        <Text style={tws("text-color-base text-4xl font-extrabold")}>
          <Text>{format(date, "EEEE")} </Text>
          <Text style={[tws("font-semibold text-2xl opacity-80")]}>
            {format(date, "d MMM")}
          </Text>
        </Text>

        <View style={[tws("flex flex-row gap-2")]}></View>
      </View>
      <ScrollView>
        <View style={[tws("flex flex-row")]}>
          {columns.map((items, i) => {
            return (
              <View key={i} style={{ width: width / 2 }}>
                {items.map((v) => (
                  <View
                    style={[
                      i === 0 ? tws("pl-4 pr-2") : tws("pr-4 pl-2"),
                      tws("py-1"),
                    ]}
                    key={v.id}
                  >
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={tws(
                        "text-lg text-neutral-900 opacity-30 dark:opacity-20 dark:text-neutral-50",
                      )}
                    >
                      {v.name}
                    </Text>
                    <TrackableProvider trackable={v}>
                      <DayCellWrapper
                        day={date.getDate()}
                        month={date.getMonth()}
                        year={date.getFullYear()}
                      ></DayCellWrapper>
                    </TrackableProvider>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
};

const DAYS = 7;

export default function Index() {
  const { height, width } = useWindowDimensions();

  const dates = eachDayOfInterval({
    start: sub(new Date(), { days: DAYS }),
    end: new Date(),
  });

  return (
    <>
      <FlashList
        snapToInterval={width}
        horizontal={true}
        data={dates}
        nestedScrollEnabled={true}
        renderItem={(i) => <DateView date={i.item} />}
        estimatedItemSize={width}
        snapToAlignment="center"
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={dates.length - 1}
      ></FlashList>
    </>
  );
}
