"use client";

import { useState } from "react";
import { z } from "zod";
import GenericInput from "../../components/_UI/Input";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioTabs, RadioTabItem } from "@/components/ui/radio-tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// TODO:
// indication of request in progress
// error handling
// motion?

type ActionState = "login" | "register";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setName] = useState("");
  const [error, setError] = useState("");

  const [action, setRegister] = useState<ActionState>("login");
  const router = useRouter();

  const buttonActive = () => {
    if (action === "register") {
      return email && password && username;
    }
    return email && password;
  };

  const buttonHandle = async () => {
    setError("");
    if (!password || !email) return;

    if (action === "register") {
      await fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          password,
        }),
        credentials: "include",
      });
    } else {
      const res = await fetch("api/login", {
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
      }
    }

    router.refresh();
  };

  return (
    <div className="m-auto max-w-md">
      <RadioTabs
        value={action}
        onValueChange={(v) => setRegister(v as ActionState)}
        className="m-auto"
      >
        <RadioTabItem value="login" id="login" className="w-full">
          Login
        </RadioTabItem>
        <RadioTabItem value="register" id="register" className="w-full">
          Register
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
        <CardContent className="flex flex-col gap-2">
          {action === "register" && (
            <GenericInput
              title="Account Name"
              value={username}
              placeholder="Name or nickname"
              schema={z.string().min(1, "Please set some account name")}
              onChange={setName}
              className="mb-2"
            />
          )}
          <GenericInput
            title="Email"
            value={email}
            placeholder="you@gmail.com"
            schema={z
              .string()
              .min(1, "Please enter an Email")
              .email("Please enter a valid Email")}
            onChange={setEmail}
            className="mb-2"
          />
          <GenericInput
            key={action}
            title="Password"
            value={password}
            type="password"
            placeholder={action === "register" ? "At least 10 characters" : ""}
            schema={
              action === "register"
                ? z
                    .string()
                    .min(1, "Please enter a password")
                    .min(10, "Password must be at least 10 characters")
                : z.string().min(1, "Please enter a password")
            }
            onChange={setPassword}
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            onClick={() => void buttonHandle()}
            disabled={!buttonActive()}
            className="w-full"
          >
            {action === "register" ? "Register" : "Login"}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>{":("}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default LoginForm;
