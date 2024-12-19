import { Switch } from "~/@shad/components/switch";
import { useUserSafe } from "~/components/Providers/UserContext";
import { useZ } from "~/utils/useZ";

export const PreserveLocationOnSidebarNavSwitch = () => {
  const { settings, id } = useUserSafe();
  const z = useZ();

  const update = (value: boolean) => {
    void z.mutate.TYL_auth_user.update({
      id,
      settings: {
        ...settings,
        preserveLocationOnSidebarNav: value,
      },
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
