import { redirect } from "next/navigation";

import { validateRequest } from "@tyl/auth";

const Page = async () => {
  const { user, session } = await validateRequest();

  if (session) {
    redirect("/app");
  } else {
    redirect("/login");
  }

  return (
    <div className="content-container flex w-full flex-col">
      landing page will be here
    </div>
  );
};

export default Page;
