import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useHookstate } from "@hookstate/core";
import { subscribable } from "@hookstate/subscribable";
import { FlashList } from "@shopify/flash-list";
import { eachDayOfInterval, sub } from "date-fns";
import { asc } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { RadixIcon } from "radix-ui-react-native-icons";
import { date } from "zod";

import { sortTrackableList } from "@tyl/helpers/trackables";

import DayCellWrapper from "~/app/_components/dayCell";
import { TrackableProvider } from "~/app/_components/trackableProvider";
import { Input } from "~/app/_ui/input";
import {
  currentUserSettings,
  setUserFavorites,
  setUserSettings,
} from "~/data/authContext";
import { db } from "~/db";
import { trackable } from "~/db/schema";
import { tws } from "~/utils/tw";

const DAYS = 7;

export default function Index() {
  const { data } = useLiveQuery(
    db.query.trackable.findMany({ orderBy: [asc(trackable.name)] }),
  );

  const [dd, setDD] = useState([
    "2aadab69-ec4e-4c89-8170-ae1d3bfa7f18",
    "020180b0-c3e7-47c6-b51f-504dda87bd46",
    "18aa61f9-b0bc-4ae2-a0d3-596fab40640e",
  ]);

  useEffect(() => {
    setDD(data.map((v) => v.id));
  }, [data]);

  useEffect(() => {
    currentUserSettings.favorites.subscribe((v) => {
      setFavorites(v);
    });
  }, []);

  const [favorites, setFavorites] = useState([
    "2aadab69-ec4e-4c89-8170-ae1d3bfa7f18",
  ]);

  const sorted = dd.sort((a, b) => {
    const at = favorites.includes(a);
    const bt = favorites.includes(b);
    if (at && !bt) return -1;
    if (bt && !at) return 1;
    return a.localeCompare(b);
  });

  const dates = eachDayOfInterval({
    start: new Date(),
    end: sub(new Date(), { days: DAYS }),
  });

  const addToFavorite = (id: string) => {
    const n = [...favorites, id];
    setFavorites(n);
    //setUserFavorites(n);
  };

  const removeFromFavorites = (id: string) => {
    const n = [...favorites.filter((v) => v !== id)];
    setFavorites(n);
    // setUserFavorites(n);
  };

  return (
    <>
      <SafeAreaView edges={["top"]} />
      <View style={[tws("px-4")]}>
        <Text style={tws("text-color-base text-4xl font-extrabold")}>
          Trackables
        </Text>

        <Input placeholder="Search by name" style={[tws("my-2")]} />
      </View>

      <FlatList
        // ref={listRef}
        data={sorted}
        keyExtractor={(v) => v}
        //  itemLayoutAnimation={LinearTransition}
        contentContainerStyle={tws("pb-4")}
        renderItem={(v) => (
          <View style={[tws("py-1 w-full")]}>
            <View
              style={[tws("flex px-4 flex-row justify-between items-center")]}
            >
              <Link
                href={{
                  pathname: "/(app)/trackables/[trackableId]",
                  params: { trackableId: v.item },
                }}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={tws(
                    "text-xl font-semibold py-1.5 text-neutral-900  dark:text-neutral-50",
                  )}
                >
                  {v.item}
                </Text>
              </Link>

              <View>
                <Pressable
                  onPress={
                    favorites.includes(v.item)
                      ? () => removeFromFavorites(v.item)
                      : () => addToFavorite(v.item)
                  }
                >
                  <RadixIcon
                    name={favorites.includes(v.item) ? "heart-filled" : "heart"}
                    size={18}
                    color="white"
                  />
                </Pressable>
              </View>
            </View>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={tws(
                "text-xs font-semibold py-1.5 text-neutral-900  dark:text-neutral-50",
              )}
            >
              {v.item}
            </Text>
          </View>
        )}
      />
    </>
  );
}

/*
 <TrackableProvider trackable={v.item}></TrackableProvider>
 <FlashList
                contentContainerStyle={tws("px-4")}
                estimatedItemSize={128}
                ItemSeparatorComponent={() => (
                  <View style={{ width: 4 }}></View>
                )}
                data={dates}
                renderItem={(v) => (
                  <DayCellWrapper
                    labelType="outside"
                    style={tws("w-40 h-20")}
                    day={v.item.getDate()}
                    month={v.item.getMonth()}
                    year={v.item.getFullYear()}
                  ></DayCellWrapper>
                )}
                horizontal={true}
                inverted={true}
              />
*/
