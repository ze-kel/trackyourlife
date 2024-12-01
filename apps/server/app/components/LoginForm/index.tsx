import type { FieldApi } from "@tanstack/react-form";
import { useState } from "react";
import { cn } from "@shad/utils";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { m } from "framer-motion";
import { TriangleAlertIcon } from "lucide-react";

import type { RegisterData } from "~/auth/authOperations";
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
import { loginFn, registerFn, registerValidator } from "~/auth/authOperations";

type ActionState = "login" | "register";

function FieldInfo({
  field,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: FieldApi<unknown, string, any, any>;
}) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <m.div
          initial={{ opacity: 0, transform: "translateY(-100%)" }}
          animate={{ opacity: 1, transform: "translateY(0)" }}
          exit={{ opacity: 0, transform: "translateY(-100%)" }}
          layout
          className="ml-2 flex w-fit items-center gap-2 rounded-b-md border border-t-0 border-neutral-200 px-3 py-1.5 font-light opacity-70 dark:border-neutral-800"
        >
          <TriangleAlertIcon size={16} strokeWidth={1.5} />
          {field.state.meta.errors.join(",")}
        </m.div>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

const Register = () => {
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: async ({ email, password, username }: RegisterData) => {
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

  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    } as RegisterData,
    onSubmit: async ({ value }) => {
      console.log(value);
      await registerMutation.mutateAsync(value);
    },

    validatorAdapter: zodValidator(),
    validators: {
      onChange: registerValidator,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.handleSubmit();
      }}
    >
      <h4 className="mb-2">Email</h4>
      <form.Field
        name="email"
        children={(field) => (
          <>
            <Input
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
              type="email"
              name="email"
              id="email"
              className="z-2 relative"
              placeholder="person@somemail.com"
            />
            <FieldInfo field={field} />
          </>
        )}
      />

      <h4 className="mb-2 mt-4">Name</h4>
      <form.Field
        name="username"
        children={(field) => (
          <>
            <Input
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
              type="text"
              name="username"
              id="username"
              placeholder="John Doe"
            />
            <FieldInfo field={field} />
          </>
        )}
      />
      <h4 className="mb-2 mt-4">Password</h4>
      <form.Field
        name="password"
        children={(field) => (
          <>
            <Input
              value={field.state.value}
              onChange={(e) => {
                field.handleChange(e.target.value);
              }}
              type="password"
              name="password"
              id="password"
            />
            <FieldInfo field={field} />
          </>
        )}
      />

      <Button
        isLoading={form.state.isSubmitting}
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
