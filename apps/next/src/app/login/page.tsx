import { redirect } from "next/navigation";

import { validateRequest } from "@tyl/auth";

import LoginForm from "./form";

const LoginPage = async () => {
  const { session } = await validateRequest();

  if (session) redirect("/app");

  return <LoginForm />;
};

export default LoginPage;
