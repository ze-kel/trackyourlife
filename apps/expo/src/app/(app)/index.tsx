import { Fragment, useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHookstate } from "@hookstate/core";
import { FlashList } from "@shopify/flash-list";
import { eachDayOfInterval, format, sub } from "date-fns";
import { asc } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { RadixIcon } from "radix-ui-react-native-icons";

import { chunk } from "@tyl/helpers";
import { sortTrackableList } from "@tyl/helpers/trackables";
import { ZTrackableSettings } from "@tyl/validators/trackable";

import DayCellWrapper from "~/app/_components/dayCell";
import { TrackableProvider } from "~/app/_components/trackableProvider";
import { Button } from "~/app/_ui/button";
import { currentUserSettings } from "~/data/authContext";
import { TrackableRecordSub } from "~/data/dbWatcher";
import { db } from "~/db";
import { trackable } from "~/db/schema";
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
  const { data } = useLiveQuery(
    db.query.trackable.findMany({ orderBy: [asc(trackable.name)] }),
  );

  const settings = useHookstate(currentUserSettings);

  const { height, width } = useWindowDimensions();

  const sortedChunked = useMemo(() => {
    const s = sortTrackableList(data, settings.get().favorites as string[]);
    return s;
  }, [settings.favorites, data]);

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
        <FlashList
          data={sortedChunked}
          estimatedItemSize={150}
          keyExtractor={(v) => v.id}
          numColumns={2}
          contentContainerStyle={tws("px-4 pb-4")}
          renderItem={(v) => (
            <View
              style={[tws("py-1 w-full", v.index % 2 == 0 ? "pr-2" : "pl-2")]}
              key={v.item.id}
            >
              <View style={[tws("flex flex-row justify-between items-center")]}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={tws(
                    "text-lg text-neutral-900 opacity-30 dark:opacity-20 dark:text-neutral-50",
                  )}
                >
                  {v.item.name}
                </Text>
                <View>
                  {settings.get().favorites.includes(v.item.id) && (
                    <RadixIcon name="heart-filled" size={12} color="white" />
                  )}
                </View>
              </View>
              <TrackableProvider trackable={v.item}>
                <DayCellWrapper
                  day={date.getDate()}
                  month={date.getMonth()}
                  year={date.getFullYear()}
                ></DayCellWrapper>
              </TrackableProvider>
            </View>
          )}
        />
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
