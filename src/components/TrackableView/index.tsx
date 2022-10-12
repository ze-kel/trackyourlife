import { ITrackable, ITrackableBoolean, ITrackableUpdate } from "@t/trackable";

import {
  getDay,
  getDaysInMonth,
  getISODay,
  getMonth,
  getYear,
  format,
} from "date-fns";
import _get from "lodash/get";
import cls from "clsx";
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IdContext } from "src/helpers/idContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { update, updateSettings } from "src/helpers/api";
import updateData from "src/helpers/updateData";
import formatDateKey from "util/formatDateKey";
import { ElObserver, ObserverContext } from "./IObserver";

const daysBeforeToday = (year: number, month: number) => {
  const now = new Date();
  if (year < getYear(now) || month < getMonth(now)) {
    return getDaysInMonth(new Date(year, month));
  }

  return now.getDate();
};

const Month = ({
  data,
  month,
  year,
}: {
  data: ITrackableBoolean["data"];
  month;
  year;
}) => {
  const toRender = getDaysInMonth(new Date(year, month));
  const dates = Array(toRender)
    .fill(0)
    .map((_, i) => i + 1);

  const beforeToday = daysBeforeToday(year, month);

  const firstDayDate = new Date(year, month, 1);
  const prefaceWith = getISODay(firstDayDate) - 1;
  const prepend = Array(prefaceWith).fill(0);

  const id = useContext(IdContext);

  const isActive = (num: number) => {
    return data[formatDateKey({ day: num, month, year })];
  };

  const queryClient = useQueryClient();

  const dateForUpdate = {
    year,
    month,
  };

  const mutation = useMutation(
    ({ day, month, year, value }: ITrackableUpdate) => {
      return update(id, { year, month, day, value });
    },
    {
      onSuccess(data, variables) {
        queryClient.setQueryData(["trackable", id], (data: ITrackable) => {
          return updateData(data, variables);
        });
      },
    }
  );

  const monthRef = useRef<HTMLDivElement>();

  const myId = `${year}-${month}`;
  const observer = useContext(ObserverContext);

  const [isVisible, setVisible] = useState<Boolean>(true);
  const [savedHeight, setSavedHeight] = useState(0);

  const recordHeightAndFlip = (newValue: boolean) => {
    if (newValue === false) {
      if (observer && monthRef.current) {
        setSavedHeight(monthRef.current.clientHeight);
      }
    }
    setVisible(newValue);
  };

  useEffect(() => {
    if (!observer || !monthRef.current) return;
    observer.watchElement(monthRef.current, recordHeightAndFlip);

    return () => {
      if (!observer || !monthRef.current) return;
      observer.unwatchElement(monthRef.current);
    };
  }, [observer]);

  if (observer && !isVisible) {
    return (
      <div
        id={myId}
        ref={monthRef}
        className="flex items-center justify-center bg-slate-200"
        style={{ height: savedHeight }}
      >
        This is a placeholder for month out of view. If you are seeing this
        something went wrong, please file a bugreport.
      </div>
    );
  }

  return (
    <div id={myId} ref={monthRef} className="">
      <h3 className="text-lg">{format(firstDayDate, "MMMM")}</h3>
      <div className="grid grid-cols-7 gap-5">
        {prepend.map((_, i) => (
          <div key={i}> </div>
        ))}
        {dates.map((el) => (
          <div
            className={cls(
              "flex h-16 items-center justify-center rounded-sm bg-slate-300",
              isActive(el) && "bg-green-600",
              beforeToday < el
                ? "bg-slate-100 text-slate-400"
                : "cursor-pointer"
            )}
            key={el}
            onClick={() =>
              mutation.mutate({
                ...dateForUpdate,
                day: el,
                value: !isActive(el),
              })
            }
          >
            {el}
          </div>
        ))}
      </div>
    </div>
  );
};

const monthsBeforeToday = (year: number) => {
  const now = new Date();
  if (year < getYear(now)) {
    return 12;
  }

  // getMonth is zero indexed, so Jan is 0
  return getMonth(now) + 1;
};

const Year = ({
  data,
  year,
}: {
  data: ITrackableBoolean["data"];
  year: number;
}) => {
  const toRender = monthsBeforeToday(year);
  const months = Array(toRender)
    .fill(0)
    .map((_, i) => i);

  return (
    <>
      <h2 className="my-3 text-2xl">{year}</h2>
      <div className="space-y-10">
        {months.map((m) => (
          <Month key={m} year={year} month={m} data={data} />
        ))}
      </div>
    </>
  );
};

const TrackableName = ({
  name,
  updater,
}: {
  name: string;
  updater: (arg0: string) => Promise<void>;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [inputVal, setInputVal] = useState(name);
  const [waiting, setWaiting] = useState(false);
  const [focusNext, setFocusNext] = useState(false);

  const goToEdit = () => {
    setInputVal(name);
    setEditMode(true);
    setFocusNext(true);
  };

  const save = async () => {
    if (waiting) return;
    setWaiting(true);
    await updater(inputVal);
    setEditMode(false);
    setWaiting(false);
  };

  const handelEdit = (e: ChangeEvent<HTMLInputElement>) => {
    if (waiting) return;
    setInputVal(e.target.value);
  };

  useEffect(() => {
    if (!focusNext || !inputRef.current) return;

    inputRef.current.focus();
    setFocusNext(false);
  }, [focusNext]);

  const inputRef = useRef<HTMLInputElement>();

  if (editMode) {
    return (
      <div>
        <input
          ref={inputRef}
          value={inputVal}
          onChange={handelEdit}
          onBlur={save}
          className="w-full border-b border-slate-800 text-2xl focus:border-b focus:outline-none"
        />
      </div>
    );
  }

  return (
    <h1
      onClick={goToEdit}
      className="cursor-text border-b border-transparent text-2xl"
    >
      {name}
    </h1>
  );
};

const TrackableView = ({ trackable }: { trackable: ITrackable }) => {
  const [yearsRendered, setYearsRendered] = useState([2022]);

  const [observer, setObserver] = useState<ElObserver>();

  const yearsRef = useRef<HTMLDivElement>();
  const loadRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new ElObserver();
    setObserver(observer);
  }, []);

  const loadNextYear = () => {
    const next = yearsRendered[yearsRendered.length - 1] - 1;
    setYearsRendered([...yearsRendered, next]);
  };

  const queryClient = useQueryClient();
  const settingsMutation = useMutation(
    (settings: ITrackable["settings"]) => {
      return updateSettings(trackable._id, settings);
    },
    {
      onSuccess(data, variables) {
        queryClient.setQueryData(
          ["trackable", trackable._id],
          (data: ITrackable) => {
            const newOne = { ...data, settings: variables };
            return newOne;
          }
        );
      },
    }
  );

  const udpateName = async (newName: string) => {
    const newSettings = { ...trackable.settings, name: newName };
    await settingsMutation.mutateAsync(newSettings);
  };

  const handleScroll = (e) => {
    const left = e.target.scrollTop + e.target.scrollHeight;
    if (left < window.innerHeight * 2) {
      loadNextYear();
    }
  };
  return (
    <div className="h-full">
      <TrackableName name={trackable.settings.name} updater={udpateName} />

      <ObserverContext.Provider value={observer}>
        <div
          className="flex h-full flex-col-reverse overflow-scroll"
          ref={yearsRef}
          onScroll={handleScroll}
        >
          {yearsRendered.map((year) => {
            return (
              <Year
                key={year}
                year={year}
                data={trackable.data as ITrackableBoolean["data"]}
              />
            );
          })}

          <div ref={loadRef} onClick={loadNextYear}>
            Load More
          </div>
        </div>
      </ObserverContext.Provider>
    </div>
  );
};

export default TrackableView;
