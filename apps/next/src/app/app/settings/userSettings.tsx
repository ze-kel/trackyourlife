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
    </div>
  );
};
