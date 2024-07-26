import { redirect } from "next/navigation";

import { validateRequest } from "@tyl/auth";

import LoginForm from "../../../app/components/form";

const LoginPage = async () => {
  const { session } = await validateRequest();

  if (session) redirect("/");

  return <LoginForm />;
};

export default LoginPage;
