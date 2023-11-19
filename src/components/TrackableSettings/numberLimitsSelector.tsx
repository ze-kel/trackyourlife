import { Input } from "@/components/ui/input";
import type { INumberSettings } from "@t/trackable";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface IRangeLabelSelector {
  value: INumberSettings["limits"];
  onChange: (a: INumberSettings["limits"]) => void;
  className?: string;
}

const NumberLimitsSelector = ({
  value,
  onChange,
  className,
}: IRangeLabelSelector) => {
  const [innerValue, setInnerValue] = useState(value);

  const [isError, setIsError] = useState(false);

  const checkValidityAndPush = (v: INumberSettings["limits"]) => {
    setInnerValue(v);

    if (v && v.min && v.max && v.min >= v.max) {
      setIsError(true);
      return;
    }

    setIsError(false);
    onChange(v);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="grid w-fit grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-x-3">
        <div className="w-52 text-neutral-400 dark:text-neutral-500">Min</div>
        <div className="w-52 text-neutral-400 dark:text-neutral-500 max-sm:row-start-3 max-sm:row-end-3">
          Max
        </div>

        <Input
          className="w-52"
          value={String(innerValue?.min)}
          onChange={(e) => {
            checkValidityAndPush({
              ...innerValue,
              min: e.target.value ? Number(e.target.value) : undefined,
            });
          }}
          error={isError}
          type="number"
        />

        <Input
          className="w-52"
          value={String(innerValue?.max)}
          onChange={(e) => {
            checkValidityAndPush({
              ...innerValue,
              max: e.target.value ? Number(e.target.value) : undefined,
            });
          }}
          error={isError}
          type="number"
        />
      </div>

      <div className="text-xs text-neutral-400 dark:text-neutral-500">
        Note: this will not change existing values even if they are beyond set
        limit
      </div>

      <div className="mt-1 flex items-center space-x-2">
        <Switch
          id="show-progress"
          checked={innerValue?.showProgress}
          onCheckedChange={(showProgress) => {
            checkValidityAndPush({
              ...innerValue,
              showProgress,
            });
          }}
        />
        <Label htmlFor="show-progress">Show progress</Label>
      </div>
    </div>
  );
};
export default NumberLimitsSelector;
