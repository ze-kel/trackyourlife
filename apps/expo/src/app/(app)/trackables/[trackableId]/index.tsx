import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function Index() {
  const { trackableId } = useLocalSearchParams<{ trackableId: string }>();

  return (
    <>
      <SafeAreaView edges={["top"]} />
      <Text style={{ color: "white" }}>alskdjlasd {trackableId} </Text>
    </>
  );
}
