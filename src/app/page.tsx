import { redirect } from "next/navigation";
import getPageSession from "src/helpers/getPageSesion";
import { prisma } from "./api/db";
import Link from "next/link";
import TrackablesList from "@components/TrackablesList";
import { Button } from "@/components/ui/button";

const Page = async () => {
  const session = await getPageSession();

  if (!session) redirect("/login");

  const entries = await prisma.trackable.findMany({
    where: { userId: session.user.userId },
    select: { id: true },
  });

  const ids = entries.map((entry) => entry.id);

  return (
    <div className="content-container flex w-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="b text-3xl font-semibold">Your Trackables</h2>
        <Link href={"/create"}>
          <Button variant="outline">Create</Button>
        </Link>
      </div>
      <div className="mt-2">
        <TrackablesList list={ids}></TrackablesList>
      </div>
    </div>
  );
};

export default Page;
