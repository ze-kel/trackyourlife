import { useRef, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack } from "expo-router";

import { Button } from "~/app/_ui/button";
import { Input } from "~/app/_ui/input";
import { useSession } from "~/app/authContext";

const LoginForm = () => {
  const { signIn } = useSession();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const host = useRef("");
  const email = useRef("");
  const password = useRef("");

  const logIn = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://" + host.current + "/api/user/logintoken",
        {
          method: "POST",
          body: JSON.stringify({
            email: email.current,
            password: password.current,
          }),
          credentials: "include",
        },
      );

      const j = (await res.json()) as Record<string, string>;

      if (!res.ok) {
        if (j.error) {
          setError(j.error);
        }
      } else {
        const { token, userId } = j;

        if (token && userId) {
          setToken(token);
          signIn({ token, host: host.current, userId });
          router.replace("/");
        } else {
          setError("Unknown error");
        }
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="">
      <Text className="text-xl">Host</Text>
      <Input
        autoCapitalize="none"
        placeholder="tyl.zekel.io"
        className="mt-2"
        onChangeText={(v) => (host.current = v)}
      />
      <Text className="mt-6 text-xl">Login</Text>
      <Input
        autoCapitalize="none"
        autoComplete="email"
        className="mt-1"
        onChangeText={(v) => (email.current = v)}
      />
      <Text className="mt-2 text-xl">Password</Text>
      <Input
        autoCapitalize="none"
        autoComplete="current-password"
        className="mt-1"
        onChangeText={(v) => (password.current = v)}
      />
      <Button className="mt-6" onPress={logIn} loading={loading}>
        Login
      </Button>
      <Text>{error}</Text>
      <Text>{token}</Text>
    </View>
  );
};

export default function Index() {
  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="bg-background h-full w-full p-4">
        <LoginForm />
      </View>
    </SafeAreaView>
  );
}
