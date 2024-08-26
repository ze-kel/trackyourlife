import { BackupAndRestore } from "./backup";
import { UserSettings } from "./userSettings";

const Page = () => {
  return (
    <div className="content-container">
      <h1 className="mb-2 text-2xl font-semibold lg:text-4xl">User settings</h1>

      <UserSettings />

      <BackupAndRestore />
    </div>
  );
};

export default Page;
