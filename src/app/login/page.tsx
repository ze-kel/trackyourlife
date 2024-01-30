import { redirect } from "next/navigation";
import LoginForm from "./form";
import { validateRequest } from "src/auth/lucia";

const LoginPage = async () => {
  const { session } = await validateRequest();

  if (session) redirect("/");

  return <LoginForm />;
};

export default LoginPage;
