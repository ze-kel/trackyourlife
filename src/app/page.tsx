import Link from "next/link";
import TrackablesList from "@components/TrackablesList";
import { Button } from "@/components/ui/button";
import { RSAGetAllTrackables } from "src/app/api/trackables/serverActions";

const Page = async () => {
  const trackables = await RSAGetAllTrackables({
    limits: { type: "last", days: 7 },
  });

  return (
    <div className="content-container flex w-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="b text-3xl font-semibold">Your Trackables</h2>
        <Link href={"/create"}>
          <Button variant="outline">Create</Button>
        </Link>
      </div>
      <div className="mt-2">
        <TrackablesList list={trackables}></TrackablesList>
      </div>
    </div>
  );
};

export default Page;
