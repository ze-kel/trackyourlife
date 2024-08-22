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
      const res = await fetch(host.current + "/api/user/logintoken", {
        method: "POST",
        body: JSON.stringify({
          email: email.current,
          password: password.current,
        }),
        credentials: "include",
      });

      const j = (await res.json()) as Record<string, string>;

      if (!res.ok) {
        if (j.error) {
          setError(j.error);
        }
      } else {
        const { token } = j;

        if (token) {
          setToken(token);
          signIn({ token, host: host.current });
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
      <Text>Host</Text>
      <Input placeholder="zekel.io" onChangeText={(v) => (host.current = v)} />
      <Text>Login</Text>
      <Input onChangeText={(v) => (email.current = v)} />
      <Text>Password</Text>
      <Input onChangeText={(v) => (password.current = v)} />
      <Button onPress={logIn}>Login</Button>
      <Text>{error}</Text>
      <Text>{token}</Text>
    </View>
  );
};

export default function Index() {
  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="bg-background h-full w-full p-4">
        <LoginForm />
      </View>
    </SafeAreaView>
  );
}
