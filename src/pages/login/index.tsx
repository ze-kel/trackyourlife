import { useState } from "react";
import Button from "@components/_UI/Button";
import { api } from "src/utils/api";
import { z } from "zod";
import { signIn } from "next-auth/react";
import GenericInput from "@components/_UI/Input";
import Page from "@components/Page";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [register, setRegister] = useState(false);

  const registerMutation = api.user.createUser.useMutation();

  const buttonHandle = async () => {
    if (!password || !email) return;

    if (register) {
      await registerMutation.mutateAsync({ name, password, email });
    }
    await signIn("credentials", {
      email: email,
      password: password,
      callbackUrl: "/",
    });
  };

  return (
    <div className="m-auto my-24 flex max-w-md flex-col rounded-md border-2 border-neutral-700 py-6 px-8">
      <h2 className="mb-5 text-3xl font-semibold">
        {register ? "Create new account" : "Welcome back!"}
      </h2>
      {register && (
        <GenericInput
          title="Account Name"
          value={name}
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
        title="Password"
        value={password}
        type="password"
        placeholder={register ? "At least 10 characters" : ""}
        schema={
          register
            ? z
                .string()
                .min(1, "Please enter a password")
                .min(10, "Password must be at least 10 characters")
            : z.string().min(1, "Please enter a password")
        }
        onChange={setPassword}
      />
      <Button
        onClick={() => void buttonHandle()}
        isActive={Boolean(email && password)}
        className="mt-4"
      >
        {register ? "Register" : "Login"}
      </Button>

      <div
        className="mt-5 cursor-pointer text-neutral-500 dark:text-neutral-400"
        onClick={() => setRegister(!register)}
      >
        {!register ? (
          <>
            Dont have an account yet?{" "}
            <span className="font-bold text-neutral-700 dark:text-neutral-200">
              Sign up
            </span>
          </>
        ) : (
          <>
            Aready have an accoutn?{" "}
            <span className="font-bold text-neutral-700 dark:text-neutral-200">
              Sign in
            </span>
          </>
        )}
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Page>
      <LoginForm />
    </Page>
  );
};

export default LoginPage;
