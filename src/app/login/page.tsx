import { redirect } from "next/navigation";
import LoginForm from "./form";
import getPageSession from "src/helpers/getPageSesion";

const LoginPage = async () => {
  const session = await getPageSession();
  if (session) redirect("/");

  return <LoginForm />;
};

export default LoginPage;
