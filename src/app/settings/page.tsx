import { UserSettings } from "src/app/settings/userSettings";

const Page = () => {
  return (
    <div className="content-container">
      <h1 className="mb-2 text-2xl font-semibold lg:text-4xl">User settings</h1>

      <UserSettings />
    </div>
  );
};

export default Page;
