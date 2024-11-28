import { useState } from "react";

import type { INumberSettings } from "@tyl/validators/trackable";

import { cn } from "~/@shad";
import { Input } from "~/@shad/input";
import { Label } from "~/@shad/label";
import { Switch } from "~/@shad/switch";

export interface IRangeLabelSelector {
  enabled: INumberSettings["progressEnabled"];
  onEnabledChange: (a: INumberSettings["progressEnabled"]) => void;
  value: INumberSettings["progress"];
  onChange: (a: INumberSettings["progress"]) => void;
  className?: string;
}

const NumberLimitsSelector = ({
  enabled,
  onEnabledChange,
  value,
  onChange,
  className,
}: IRangeLabelSelector) => {
  const [innerEnabled, setInnerEnabled] = useState(enabled ?? false);
  const [innerMin, setInnerMin] = useState(String(value?.min ?? "0"));
  const [innerMax, setInnerMax] = useState(String(value?.max ?? "100"));

  const [isError, setIsError] = useState(false);

  const checkValidityAndPush = (min: number, max: number) => {
    if (
      typeof min === "number" &&
      typeof max === "number" &&
      !isNaN(min) &&
      !isNaN(max) &&
      max > min
    ) {
      setIsError(false);
      onChange({ min, max });
      return;
    }
    setIsError(true);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="mt-1 flex items-center space-x-2">
        <Switch
          id="show-progress"
          checked={innerEnabled}
          onCheckedChange={(v) => {
            setInnerEnabled(v);
            onEnabledChange(v);
            if (!value) {
              onChange({ min: 0, max: 100 });
            }
          }}
        />
        <Label htmlFor="show-progress">Show progress</Label>
      </div>
      {innerEnabled && (
        <div className="mt-2 grid w-fit grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-x-3">
          <div className="w-52 text-neutral-400 dark:text-neutral-500">0%</div>
          <div className="w-52 text-neutral-400 dark:text-neutral-500 max-sm:row-start-3 max-sm:row-end-3">
            100%
          </div>
          <Input
            className="w-52"
            value={innerMin}
            onChange={(e) => {
              if (e.target.value === "-" || e.target.value === "") {
                setInnerMin(e.target.value);
              } else {
                if (Number.isNaN(e.target.valueAsNumber)) return;
                setInnerMin(String(e.target.valueAsNumber));
                checkValidityAndPush(e.target.valueAsNumber, Number(innerMax));
              }
            }}
            error={isError}
            type="number"
          />
          <Input
            className="w-52"
            value={innerMax}
            onChange={(e) => {
              if (e.target.value === "-" || e.target.value === "") {
                setInnerMax(e.target.value);
              } else {
                if (Number.isNaN(e.target.valueAsNumber)) return;
                setInnerMax(String(e.target.valueAsNumber));
                checkValidityAndPush(Number(innerMin), e.target.valueAsNumber);
              }
            }}
            error={isError}
            type="number"
          />
        </div>
      )}
    </div>
  );
};
export default NumberLimitsSelector;
