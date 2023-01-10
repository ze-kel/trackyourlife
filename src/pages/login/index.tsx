import { useState } from "react";
import type { ISelectorOption } from "@components/_UI/Selector";
import Selector from "@components/_UI/Selector";
import Button from "@components/_UI/Button";
import { api } from "src/utils/api";
import { z } from "zod";
import { signIn, getSession } from "next-auth/react";
import GenericInput from "@components/_UI/Input";

const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [register, setRegister] = useState(false);

  const registerMutation = api.user.createUser.useMutation();

  const selectorOptions: ISelectorOption[] = [
    { label: "Login", value: false },
    { label: "Register", value: true },
  ];

  const buttonHandle = async () => {
    if (!password || !email) return;

    if (register) {
      await registerMutation.mutateAsync({ name, password, email });
    } else {
      const s = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });
      console.log("s", s);

      const session = await getSession();
      console.log("session", session);
    }
  };

  return (
    <div className="flex flex-col ">
      <Selector
        options={selectorOptions}
        active={register}
        setter={setRegister}
      />
      <h2 className="text-xl"> {register ? "Register" : "Login"} </h2>

      {register && (
        <GenericInput
          title="text"
          value={name}
          placeholder="Kel"
          schema={z.string().min(1, "Please set some account name")}
          onChange={setName}
        />
      )}
      <GenericInput
        title="Email"
        value={email}
        placeholder="kel@gmail.com"
        schema={z
          .string()
          .min(1, "Please enter an Email")
          .regex(EMAIL_REGEX, "Please enter a valid Email")}
        onChange={setEmail}
      />
      <GenericInput
        title="Password"
        value={password}
        type="password"
        placeholder="something very secret"
        schema={z
          .string()
          .min(1, "Please enter a password")
          .min(10, "Password must be at least 10 characters")}
        onChange={setPassword}
        className="my-2"
      />
      <Button
        onClick={() => void buttonHandle()}
        isActive={Boolean(email && password)}
      >
        {register ? "Register" : "Login"}
      </Button>
    </div>
  );
};

const LoginPage = () => {
  const users = api.user.getUsers.useQuery();
  return (
    <div className="content-container">
      Users
      <div>{JSON.stringify(users.data)}</div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
