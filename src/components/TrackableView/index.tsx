import { getDaysInMonth, getISODay, getMonth, getYear, format } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";
import { ElObserver, ObserverContext } from "./IObserver";
import TrackableName from "./trackableName";
import DeleteButton from "./deleteButton";
import DayCell from "./dayCell";

const Month = ({ month, year }: { month; year }) => {
  const toRender = getDaysInMonth(new Date(year, month));
  const dates = Array(toRender)
    .fill(0)
    .map((_, i) => i + 1);

  const firstDayDate = new Date(year, month, 1);
  const prefaceWith = getISODay(firstDayDate) - 1;
  const prepend = Array(prefaceWith).fill(0);

  const monthRef = useRef<HTMLDivElement>();

  const myId = `${year}-${month}`;
  const observer = useContext(ObserverContext);

  const [isVisible, setVisible] = useState<boolean>(true);
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

  return (
    <div>
      <h3 className="sticky top-0 z-10 bg-white pt-2 text-lg">
        <span className="font-bold">{format(firstDayDate, "MMMM")}</span>{" "}
        <span>{year}</span>
      </h3>

      {observer && !isVisible ? (
        <div
          id={myId}
          ref={monthRef}
          className="flex items-center justify-center text-zinc-200"
          style={{ height: savedHeight }}
        >
          This is a placeholder for month out of view. If you are seeing this
          something went wrong, please file a bugreport.
        </div>
      ) : (
        <div
          id={myId}
          ref={monthRef}
          className="grid grid-cols-7 sm:gap-2 lg:gap-3"
        >
          {prepend.map((_, i) => (
            <div key={i}> </div>
          ))}
          {dates.map((el) => (
            <DayCell key={el} year={year} month={month} day={el} />
          ))}
        </div>
      )}
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

const Year = ({ year }: { year: number }) => {
  const toRender = monthsBeforeToday(year);
  const months = Array(toRender)
    .fill(0)
    .map((_, i) => i);

  return (
    <>
      <div className="content-container space-y-10">
        {months.map((m) => (
          <Month key={m} year={year} month={m} />
        ))}
      </div>
    </>
  );
};

const TrackableView = () => {
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

  const handleScroll = (e) => {
    const left = e.target.scrollTop + e.target.scrollHeight;
    if (left < window.innerHeight * 2) {
      loadNextYear();
    }
  };
  return (
    <div className="grid h-full max-h-full w-full">
      <div className="content-container flex w-full justify-between py-2">
        <TrackableName />
        <DeleteButton />
      </div>

      <ObserverContext.Provider value={observer}>
        <div
          className="relative box-border flex w-full flex-col-reverse overflow-scroll pb-10"
          ref={yearsRef}
          onScroll={handleScroll}
        >
          {yearsRendered.map((year) => {
            return <Year key={year} year={year} />;
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
