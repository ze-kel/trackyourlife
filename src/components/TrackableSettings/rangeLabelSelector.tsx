import type { IRangeSettings } from "@t/trackable";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { PureInput } from "@components/_UI/Input";
import { cloneDeep } from "lodash";
import { useState } from "react";
import Dropdown from "@components/_UI/Dropdown";
import clsx from "clsx";
import { Emoji } from "@components/_UI/Emoji";
import XIcon from "@heroicons/react/24/outline/XMarkIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";

export interface IRangeLabelSelector {
  initialValue: IRangeSettings["labels"];
  onChange: (a: IRangeSettings["labels"]) => void;
}

type IRangeLabel = {
  internalKey: string;
  emojiShortcode: string;
};

const Pair = ({
  value,
  update,
  duplicate,
  remove,
}: {
  value: IRangeLabel;
  update: (v: IRangeLabel) => void;
  className?: string;
  duplicate: boolean;
  remove: () => void;
}) => {
  const [dropdown, setDropdown] = useState(false);

  const updateKey = (val: string) => {
    update({ ...value, internalKey: val });
  };

  const selectEmoji = (input: { shortcodes: string }) => {
    update({ ...value, emojiShortcode: input.shortcodes });
    setDropdown(false);
  };

  return (
    <>
      <PureInput
        value={value.internalKey}
        className={clsx("col-start-1 col-end-1 mr-2 w-64")}
        error={duplicate || !value.internalKey}
        onChange={(e) => updateKey(e.target.value)}
      />
      <Dropdown
        placement="right"
        visible={dropdown}
        setVisible={setDropdown}
        hiddenPart={<Picker data={data} onEmojiSelect={selectEmoji} />}
        mainPart={<Emoji size="30px" shortcodes={value.emojiShortcode} />}
        classNameMain={"w-fit cursor-pointer col-start-2 col-end-2"}
      />
      <div
        className="col-start-3 col-end-3 flex w-10 cursor-pointer items-center justify-center"
        onClick={remove}
      >
        <XIcon className="w-7 transition-colors dark:text-neutral-700 dark:hover:text-neutral-100" />
      </div>
    </>
  );
};

const RangeLabelSelector = ({
  initialValue,
  onChange,
}: IRangeLabelSelector) => {
  const [value, updateValue] = useState(initialValue || []);
  const [error, updateError] = useState<string>();

  const checkDuplicates = (index: number) => {
    const tVal = value[index];
    for (let i = 0; i < value.length; i++) {
      if (value[i]?.internalKey === tVal?.internalKey && i !== index) {
        return true;
      }
    }
    return false;
  };

  const pushUpdates = (value: IRangeLabel[]) => {
    const set = new Set();
    for (const val of value) {
      if (!val.internalKey.length) {
        updateError("Empty key is present. Last valid state will be saved");
        return;
      }
      if (set.has(val.internalKey)) {
        updateError("Duplicate key is present. Last valid state will be saved");
        return;
      }
      set.add(val.internalKey);
    }
    updateError("");
    onChange(value);
  };

  const changeByIndex = (index: number, v: IRangeLabel) => {
    const upd = cloneDeep(value);

    try {
      upd[index] = v;
      updateValue(upd);
      pushUpdates(upd);
    } catch (e) {
      throw e;
    }
  };

  const addNewProperty = () => {
    const upd = [
      ...value,
      { internalKey: "newLabel", emojiShortcode: ":question:" },
    ];
    updateValue(upd);
    pushUpdates(upd);
  };

  const removeByIndex = (i: number) => {
    const upd = cloneDeep(value);
    upd.splice(i, 1);
    updateValue(upd);
    pushUpdates(upd);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="grid w-fit auto-cols-min items-center gap-x-2">
        {value.length > 0 && (
          <>
            <div className="col-start-1 col-end-1 text-sm text-neutral-300 dark:text-neutral-500">
              Value
            </div>
            <div className="col-start-2 col-end-2 text-sm text-neutral-300 dark:text-neutral-500">
              Icon
            </div>
            <div className="col-start-3 col-end-3 text-sm text-neutral-300 dark:text-neutral-500"></div>
          </>
        )}

        {value.map((el, index) => {
          return (
            <Pair
              key={index}
              value={el}
              duplicate={checkDuplicates(index)}
              update={(v) => changeByIndex(index, v)}
              remove={() => removeByIndex(index)}
            />
          );
        })}
        <div
          className="flex cursor-pointer justify-center whitespace-nowrap text-neutral-300 transition-colors dark:text-neutral-700 dark:hover:text-neutral-100 "
          onClick={addNewProperty}
        >
          <PlusIcon className="mr-1 w-4" />
          Add new
        </div>
      </div>
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default RangeLabelSelector;
