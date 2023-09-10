import { redirect } from "next/navigation";
import getPageSession from "src/helpers/getPageSesion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getBaseUrl } from "src/helpers/getBaseUrl";
import { cookies } from "next/headers";

export const revalidate = 0;

const Page = async () => {
  const session = await getPageSession();

  if (!session) redirect("/login");

  const res = await fetch(getBaseUrl() + "/api/trackables", {
    method: "GET",
    headers: {
      Cookie: cookies().toString(),
    },
  });

  const { ids } = (await res.json()) as { ids: string[] };

  return (
    <div className="content-container flex w-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="b text-3xl font-semibold">Your Trackables</h2>
        <Link href={"/create"}>
          <Button variant="outline">Create</Button>
        </Link>
      </div>
      <div className="mt-2">{JSON.stringify(ids)}</div>
    </div>
  );
};

export default Page;
