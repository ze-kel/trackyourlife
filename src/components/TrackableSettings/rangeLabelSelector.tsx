import type { IRangeSettings } from "@t/trackable";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { PureInput } from "@components/_UI/Input";
import { cloneDeep } from "lodash";
import { useState } from "react";
import Dropdown from "@components/_UI/Dropdown";
import clsx from "clsx";
import { Emoji } from "@components/_UI/Emoji";

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
  className,
  duplicate,
}: {
  value: IRangeLabel;
  update: (v: IRangeLabel) => void;
  className?: string;
  duplicate: boolean;
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
    <div className={clsx("flex items-center", className)}>
      <PureInput
        value={value.internalKey}
        className={clsx("mr-2 w-64")}
        error={duplicate || !value.internalKey}
        onChange={(e) => updateKey(e.target.value)}
      />
      <Dropdown
        placement="right"
        visible={dropdown}
        setVisible={setDropdown}
        hiddenPart={<Picker data={data} onEmojiSelect={selectEmoji} />}
        mainPart={
          <div className="cursor-pointer">
            <Emoji size="30px" shortcodes={value.emojiShortcode} />
          </div>
        }
      />
    </div>
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
      if (set.has(val.internalKey) || !val.internalKey.length) {
        updateError("Duplicate key is present. Last valid state will be saved");
        return;
      }
      set.add(val.internalKey);
    }
    updateError("Empty key is present. Last valid state will be saved");
    onChange(value);
  };

  const changeByIndex = (index: number, v: IRangeLabel) => {
    const newValue = cloneDeep(value);

    try {
      newValue[index] = v;
      updateValue(newValue);
      pushUpdates(newValue);
    } catch (e) {
      throw e;
    }
  };

  const addNewProperty = () => {
    updateValue([
      ...value,
      { internalKey: "newLabel", emojiShortcode: ":question:" },
    ]);
  };

  return (
    <div className="flex flex-col gap-1">
      {value.map((el, index) => {
        return (
          <Pair
            className=""
            key={index}
            value={el}
            duplicate={checkDuplicates(index)}
            update={(v) => changeByIndex(index, v)}
          />
        );
      })}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default RangeLabelSelector;
