import timezones from "timezones-list";

import { CurrentTime, TimezoneSelector } from "./timezoneSelector";

export const UserSettings = () => {
  return (
    <div>
      <div className="flex gap-2">
        <h2 className="text-xl">Timezone</h2>
        <CurrentTime />
      </div>

      <TimezoneSelector list={timezones} />

      <p className="mt-2 text-xs opacity-50">
        Used to accurately determine time when rendering on the server. Has no
        effect on mobile app.{" "}
      </p>
    </div>
  );
};
