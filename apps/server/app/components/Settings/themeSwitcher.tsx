import { useTheme } from "next-themes";
import { useIsClient } from "usehooks-ts";

import { RadioTabItem, RadioTabs } from "~/@shad/components/radio-tabs";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();

  return (
    <>
      <RadioTabs
        value={isClient ? theme : undefined}
        onValueChange={setTheme}
        className="w-fit"
      >
        <RadioTabItem value="light" id="light">
          Light
        </RadioTabItem>
        <RadioTabItem value="system" id="system">
          System
        </RadioTabItem>
        <RadioTabItem value="dark" id="dark">
          Dark
        </RadioTabItem>
      </RadioTabs>{" "}
    </>
  );
};
