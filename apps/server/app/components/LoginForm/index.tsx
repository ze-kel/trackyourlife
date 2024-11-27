import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { cn } from "~/@shad";
import { Alert, AlertDescription, AlertTitle } from "~/@shad/alert";
import { Button } from "~/@shad/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/@shad/card";
import { Input } from "~/@shad/input";
import { RadioTabItem, RadioTabs } from "~/@shad/radio-tabs";
import { loginFn } from "~/auth/auth";

type ActionState = "login" | "register";

const Register = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const onSubmit = async () => {
    setLoading(true);
    const res = await fetch("api/user/create", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        username,
      }),
      credentials: "include",
    });

    if (!res.ok) {
      const j = (await res.json()) as Record<string, string>;
      if (j.error) {
        setError(j.error);
      }
      setLoading(false);
      return;
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit();
      }}
    >
      <h4 className="mb-2">Email</h4>
      <Input
        type="email"
        value={email}
        placeholder="person@somemail.com"
        onChange={(e) => setEmail(e.target.value)}
      />

      <h4 className="mb-2 mt-4">Name</h4>
      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <h4 className="mb-2 mt-4">Password</h4>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        isLoading={loading}
        size={"lg"}
        type="submit"
        variant="outline"
        className={cn("mt-6 w-full")}
      >
        Create Account
      </Button>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle className="font-bold">Something is wrong</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};

const Login = () => {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const r = await loginFn({ data: { email, password } });
      if (!r.ok) {
        throw new Error(r.message);
      }
    },
    onSuccess: async () => {
      await router.invalidate();
      router.navigate({ to: "/" });
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        console.log(formData.get("email"));
        loginMutation.mutate({
          email: formData.get("email") as string,
          password: formData.get("password") as string,
        });
      }}
    >
      <h4 className="mb-2">Email</h4>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder="person@somemail.com"
      />
      <h4 className="mb-2 mt-4">Password</h4>
      <Input id="password" name="password" type="password" />

      <Button
        isLoading={loginMutation.isPending}
        type="submit"
        size={"lg"}
        variant="outline"
        className={cn("mt-6 w-full")}
      >
        Login
      </Button>
      {loginMutation.error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle className="font-bold">Something is wrong</AlertTitle>
          <AlertDescription>{loginMutation.error.message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};

const LoginForm = () => {
  const [action, setRegister] = useState<ActionState>("login");

  return (
    <div className="m-auto max-w-md max-sm:px-4">
      <RadioTabs
        value={action}
        onValueChange={(v) => setRegister(v as ActionState)}
        className="m-auto"
      >
        <RadioTabItem value="login" id="login" className="w-full">
          Existing user
        </RadioTabItem>
        <RadioTabItem value="register" id="register" className="w-full">
          New user
        </RadioTabItem>
      </RadioTabs>
      <Card className="m-auto mt-4">
        <CardHeader>
          <CardTitle>
            {action === "register" ? "Hello" : "Welcome back"}
          </CardTitle>
          <CardDescription>
            {action === "register"
              ? "Let's get to know each other!"
              : "Glad to see you again!"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {action === "login" && <Login />}
          {action === "register" && <Register />}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
