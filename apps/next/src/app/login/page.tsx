import { redirect } from "next/navigation";
import LoginForm from "./form";
import { validateRequest } from "@tyl/auth";

const LoginPage = async () => {
  const { session } = await validateRequest();

  if (session) redirect("/");

  return <LoginForm />;
};

export default LoginPage;
