import { useRef, useState } from "react";
import { LayoutAnimation, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";

export default function Index() {
  const [data, setData] = useState(["1", "2", "3", "4", "5"]);

  const [favorites, setFavorites] = useState(["1"]);

  const listRef = useRef<FlashList<string> | null>(null);

  const removeItem = (item: string) => {
    setFavorites([...favorites.filter((v) => v !== item)]);
    //setData([...data]);
    listRef.current?.prepareForLayoutAnimationRender();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const addItem = (item: string) => {
    setFavorites([...favorites, item]);
    //setData([...data]);
    listRef.current?.prepareForLayoutAnimationRender();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const sorted = data.sort((a, b) => {
    const at = favorites.includes(a);
    const bt = favorites.includes(b);
    if (at && !bt) return -1;
    if (bt && !at) return 1;
    return a.localeCompare(b);
  });

  const renderItem = ({ item }: { item: string }) => {
    return (
      <Pressable
        onPress={() => {
          if (favorites.includes(item)) {
            removeItem(item);
          } else {
            addItem(item);
          }
        }}
      >
        <View
          style={{
            height: 100,
            backgroundColor: favorites.includes(item) ? "red" : "white",
          }}
        >
          <Text>Cell Id: {item}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <FlashList
      ListHeaderComponent={() => (
        <>
          <SafeAreaView edges={["top"]} />
          <Text style={{ color: "white" }}>
            {JSON.stringify(favorites)}

            {favorites.includes("1") ? "y" : "n"}
          </Text>
        </>
      )}
      ref={listRef}
      keyExtractor={(item: string) => {
        return item;
      }}
      id="asl;kdjds"
      renderItem={renderItem}
      estimatedItemSize={100}
      data={sorted}
    />
  );
}
