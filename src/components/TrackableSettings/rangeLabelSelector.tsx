/* eslint-disable @typescript-eslint/no-namespace */
import type { IRangeSettings } from "@t/trackable";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { PureInput } from "@components/_UI/Input";
import { cloneDeep } from "lodash";
import { ReactElement, useEffect, useState } from "react";
import Button from "@components/_UI/Button";
import Dropdown from "@components/_UI/Dropdown";
import { init } from "emoji-mart";
import clsx from "clsx";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["em-emoji"]: { shortcodes: string; size: string };
    }
  }
}
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
    if (!val) return;
    update({ ...value, internalKey: val });
  };

  const selectEmoji = (input: { shortcodes: string }) => {
    update({ ...value, emojiShortcode: input.shortcodes });
    setDropdown(false);
  };

  return (
    <div className={clsx("flex", className)}>
      hello
      {JSON.stringify(duplicate)}
      <PureInput
        value={value.internalKey}
        className={clsx("mr-2 w-64", !duplicate && "border-orange-600")}
        onChange={(e) => updateKey(e.target.value)}
      />
      <Dropdown
        vAlign="center"
        visible={dropdown}
        setVisible={setDropdown}
        hiddenPart={<Picker data={data} onEmojiSelect={selectEmoji} />}
        mainPart={
          <div className="cursor-pointer">
            <em-emoji
              shortcodes={value.emojiShortcode || ":question:"}
              size="30px"
            />
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
  useEffect(() => {
    void init({ data });
  }, []);

  const [value, updateValue] = useState(initialValue || []);
  const [error, updateError] = useState<boolean>(false);

  const checkDuplicates = (index: number) => {
    console.log("dup", index);
    const tVal = value[index];
    for (let i = 0; i < value.length; i++) {
      if (value[i]?.internalKey === tVal && i !== index) {
        return true;
      }
    }
    return false;
  };

  const pushUpdates = () => {
    const set = new Set();
    for (const val of value) {
      if (set.has(val.internalKey) || !val.internalKey.length) {
        updateError(true);
        return;
      }
      set.add(val.internalKey);
    }
    updateError(false);
    onChange(value);
  };

  const changeByIndex = (index: number, v: IRangeLabel) => {
    const newValue = cloneDeep(value);

    try {
      newValue[index] = v;
      updateValue(newValue);
      pushUpdates();
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
    <div>
      {error && (
        <div>
          There is something wrong with your data. Last valid state will be
          saved.
        </div>
      )}
      {value.map((el, index) => {
        return (
          <Pair
            className="my-2"
            key={index}
            value={el}
            duplicate={checkDuplicates(index)}
            update={(v) => changeByIndex(index, v)}
          />
        );
      })}
      <Button onClick={addNewProperty}>Add</Button>
    </div>
  );
};

export default RangeLabelSelector;
