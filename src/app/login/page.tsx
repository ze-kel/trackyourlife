import { auth } from "src/auth/lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./form";

const LoginPage = async () => {
  const authRequest = auth.handleRequest({
    request: null,
    cookies,
  });
  const session = await authRequest.validate();
  if (session) redirect("/");

  return <LoginForm />;
};

export default LoginPage;
