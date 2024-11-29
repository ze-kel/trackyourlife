import type { ReactNode } from "react";
import { createContext } from "react";

import type { ITrackable } from "@tyl/validators/trackable";

import { MemoDayCellProvider } from "~/components/Providers/DayCellProvider";
import { useTrackableMeta, useTrackableSettings } from "~/query/trackable";

interface ITrackableContext {
  id: ITrackable["id"];
}

export const TrackableContext = createContext<ITrackableContext | null>(null);

const TrackableProvider = ({
  id,
  children,
}: {
  id: ITrackable["id"];
  children: ReactNode;
}) => {
  const { data: trackable } = useTrackableMeta({ id });
  const { data: settings } = useTrackableSettings({ id });

  return (
    <TrackableContext.Provider
      value={{
        id: id,
      }}
    >
      <MemoDayCellProvider type={trackable?.type} settings={settings}>
        {children}
      </MemoDayCellProvider>
    </TrackableContext.Provider>
  );
};

export default TrackableProvider;
