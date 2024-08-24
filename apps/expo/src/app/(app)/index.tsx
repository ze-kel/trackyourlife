import { Fragment, useState } from "react";
import { ScrollView, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { ZTrackableSettings } from "@tyl/validators/trackable";

import DayCellWrapper from "~/app/_components/dayCell";
import { TrackableProvider } from "~/app/_components/trackableProvider";
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

export default function Index() {
  const { data } = useLiveQuery(db.query.trackable.findMany());
  const [value, setValue] = useState("true");

  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        tws(""),
        { flex: 1, justifyContent: "center", alignItems: "center" },
      ]}
    >
      <SafeAreaView edges={["top"]} />
      <ScrollView>
        <View
          style={[tws("flex  flex-row flex-wrap justify-start gap-4 px-4")]}
        >
          {data.map((v) => (
            <View key={v.id} style={tws("w-[50%]")}>
              <Text
                style={tws(
                  "text-lg text-neutral-900 opacity-30 dark:opacity-20 dark:text-neutral-50",
                )}
              >
                {v.name}
              </Text>
              <TrackableProvider trackable={v}>
                <Today />
              </TrackableProvider>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
