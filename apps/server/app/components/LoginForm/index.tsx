import { useState } from "react";
import { cn } from "@shad/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import { Alert, AlertDescription, AlertTitle } from "~/@shad/components/alert";
import { Button } from "~/@shad/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/@shad/components/card";
import { Input } from "~/@shad/components/input";
import { RadioTabItem, RadioTabs } from "~/@shad/components/radio-tabs";
import { loginFn, registerFn } from "~/auth/authOperations";

type ActionState = "login" | "register";

const Register = () => {
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      username,
    }: {
      email: string;
      password: string;
      username: string;
    }) => {
      const r = await registerFn({ data: { email, password, username } });
      if (!r.ok) {
        throw new Error(r.message);
      }
    },
    onSuccess: async () => {
      await router.invalidate();
      await router.navigate({ to: "/" });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        registerMutation.mutate({
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          username: formData.get("username") as string,
        });
      }}
    >
      <h4 className="mb-2">Email</h4>
      <Input
        type="email"
        name="email"
        id="email"
        placeholder="person@somemail.com"
      />

      <h4 className="mb-2 mt-4">Name</h4>
      <Input type="text" name="username" id="username" placeholder="John Doe" />

      <h4 className="mb-2 mt-4">Password</h4>
      <Input name="password" id="password" type="password" />

      <Button
        isLoading={registerMutation.isPending}
        size={"lg"}
        type="submit"
        variant="outline"
        className={cn("mt-6 w-full")}
      >
        Create Account
      </Button>
      {registerMutation.error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle className="font-bold">Something is wrong</AlertTitle>
          <AlertDescription>{registerMutation.error.message}</AlertDescription>
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
      await router.navigate({ to: "/" });
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
