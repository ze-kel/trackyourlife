"use client";
import type { IUserSettings } from "@t/user";
import type { ReactNode } from "react";
import { createContext, useOptimistic } from "react";

interface ISettingsContext {
  settings?: IUserSettings;
  updateSettings?: (v: IUserSettings) => void;
}

const SettingsContext = createContext<ISettingsContext>({});

const UserSettingsProvider = ({
  initialSettings,
  children,
}: {
  initialSettings: IUserSettings;
  children: ReactNode;
}) => {
  const [settings, updateSettings] =
    useOptimistic<IUserSettings>(initialSettings);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default UserSettingsProvider;
