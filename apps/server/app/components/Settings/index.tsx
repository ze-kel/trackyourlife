import { Switch } from "~/@shad/components/switch";
import { useUserSettings, useUserSettingsMutation } from "~/query/userSettings";

export const PreserveLocationOnSidebarNavSwitch = () => {
  const settings = useUserSettings();
  const { updateSettingsPartial } = useUserSettingsMutation();

  const update = (value: boolean) => {
    void updateSettingsPartial({
      preserveLocationOnSidebarNav: value,
    });
  };

  return (
    <>
      <Switch
        checked={settings.preserveLocationOnSidebarNav}
        onCheckedChange={update}
      />
      {settings.preserveLocationOnSidebarNav ? "Enabled" : "Disabled"}
    </>
  );
};
