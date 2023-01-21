import DeleteButton from "@components/TrackableView/deleteButton";
import TrackableName from "@components/TrackableView/trackableName";

const TrackableSettings = () => {
  return (
    <div className="content-container flex h-full max-h-full w-full flex-col">
      <div className=" flex w-full justify-between py-4">
        <TrackableName />
        <DeleteButton />
      </div>
      <div>Settings Go Here</div>
    </div>
  );
};

export default TrackableSettings;
