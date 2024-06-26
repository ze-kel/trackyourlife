import {
  CurrentTime,
  TimezoneSelector,
} from "src/app/settings/timezoneSelector";

export const UserSettings = () => {
  return (
    <div>
      <div className="flex gap-2">
        <h2 className="text-xl">Timezone</h2>
        <CurrentTime />
      </div>

      <TimezoneSelector />
    </div>
  );
};
