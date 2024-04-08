"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioTabs, RadioTabItem } from "@/components/ui/radio-tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { cn } from "@/lib/utils";

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

    router.refresh();
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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    setLoading(true);
    const res = await fetch("api/user/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
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

    router.refresh();
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
      <h4 className="mb-2 mt-4">Password</h4>
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button
        isLoading={loading}
        type="submit"
        variant="outline"
        className={cn("mt-6 w-full")}
      >
        Login
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

const LoginForm = () => {
  const [action, setRegister] = useState<ActionState>("login");

  return (
    <div className="m-auto max-w-md">
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
