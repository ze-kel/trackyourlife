import { ITrackable } from "@t/trackable";
import Link from "next/link";

const TrackableView = ({ trackable }: { trackable: ITrackable }) => {
  return <div>{JSON.stringify(trackable)}</div>;
};

export default TrackableView;
