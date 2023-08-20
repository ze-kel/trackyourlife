import { PureInput } from '@components/_UI/Input';
import type { INumberSettings } from '@t/trackable';
import clsx from 'clsx';
import { useState } from 'react';

export interface IRangeLabelSelector {
  value: INumberSettings['limits'];
  onChange: (a: INumberSettings['limits']) => void;
  className?: string;
}

const NumberLimitsSelector = ({
  value,
  onChange,
  className,
}: IRangeLabelSelector) => {
  const [innerValue, setInnerValue] = useState(value);

  const [isError, setIsError] = useState(false);

  const checkValidityAndPush = (v: INumberSettings['limits']) => {
    setInnerValue(v);

    if (v && v.min && v.max && v.min >= v.max) {
      setIsError(true);
      return;
    }

    setIsError(false);
    onChange(v);
  };

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <div className="flex gap-2 text-neutral-400 dark:text-neutral-500">
        <div className="w-52">Min</div>
        <div className="w-52">Max</div>
      </div>

      <div className="flex gap-2">
        <PureInput
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
        <PureInput
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

      <label className="flex">
        <input
          type={'checkbox'}
          checked={innerValue?.showProgress}
          onChange={(e) => {
            console.log('et', e.target.checked);
            checkValidityAndPush({
              ...innerValue,
              showProgress: e.target.checked,
            });
          }}
        />
        <div className="ml-2 text-neutral-400 dark:text-neutral-500">
          Show progress
        </div>
      </label>
    </div>
  );
};
export default NumberLimitsSelector;
