"use client";
import type { IRangeSettings } from "@t/trackable";
import GenericInput, { PureInput } from "@components/_UI/Input";
import cloneDeep from "lodash/cloneDeep";
import { useState } from "react";
import clsx from "clsx";
import { AnimatePresence } from "framer-motion";
import { Reorder, useDragControls } from "framer-motion";
import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import type { ArrayElement } from "@t/helpers";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import emojiRegex from "emoji-regex";
import Button from "@components/_UI/Button";

export interface IRangeLabelSelector {
  initialValue: IRangeSettings["labels"];
  onChange: (a: IRangeSettings["labels"]) => void;
}

type IRangeLabel = ArrayElement<NonNullable<IRangeSettings["labels"]>>;

const regex = emojiRegex();

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
  const controls = useDragControls();

  const updateKey = (val: string) => {
    update({ ...value, internalKey: val });
  };

  const selectEmoji = (val: string) => {
    const emojis = val.matchAll(regex);

    let lastOne = "";

    for (const match of emojis) {
      lastOne = match[0];
    }

    update({ ...value, emoji: lastOne });
    return lastOne;
  };

  return (
    <Reorder.Item
      value={value}
      itemID={value.id}
      transition={{
        duration: 0.25,
        opacity: { duration: 0.2, ease: "circIn" },
      }}
      initial={{ opacity: 0, y: 10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "45px", zIndex: 2 }}
      exit={{ opacity: 0, height: 0, zIndex: -99 }}
      dragControls={controls}
      className="relative flex items-center gap-2"
      layout
    >
      <PureInput
        value={value.internalKey}
        className={clsx("col-start-1 col-end-1 w-64")}
        error={duplicate || !value.internalKey}
        onChange={(e) => updateKey(e.target.value)}
      />
      <GenericInput
        value={value.emoji}
        onChange={selectEmoji}
        schema={z.string().emoji("")}
        className="w-10"
        noError
        updateFromOnchage
      ></GenericInput>

      <div
        className="flex w-7 cursor-pointer items-center justify-center"
        onClick={remove}
      >
        <Cross1Icon className="text-neutral-300 transition-colors hover:text-neutral-800 dark:text-neutral-700 dark:hover:text-neutral-100" />
      </div>
    </Reorder.Item>
  );
};

const addIds = (value: IRangeLabel[] = []) => {
  const v2 = cloneDeep(value);

  v2.forEach((item) => {
    if (!item.id) {
      item.id = uuidv4();
    }
  });
  return v2;
};

const RangeLabelSelector = ({
  initialValue,
  onChange,
}: IRangeLabelSelector) => {
  const [value, updateValue] = useState(addIds(initialValue) || []);
  const [error, updateError] = useState<string>();
  const controls = useDragControls();

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

  const updateAndPush: IRangeLabelSelector["onChange"] = (value = []) => {
    updateValue(value);
    pushUpdates(value);
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
      { internalKey: "newLabel", emoji: "❓", id: uuidv4() },
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
      {error && <div className="text-xs text-red-500">{error}</div>}
      <div className="mb-1 flex w-fit flex-col">
        {value.length > 0 && (
          <div className="flex w-full gap-2 text-xs text-neutral-400 dark:text-neutral-500">
            <div className="w-64 ">Value</div>
            <div>Icon</div>
            <div></div>
          </div>
        )}

        <Reorder.Group
          as="div"
          axis="y"
          values={value}
          onReorder={updateAndPush}
          dragControls={controls}
          dragListener={false}
          layout
          transition={{ duration: 0.1 }}
        >
          <AnimatePresence initial={false}>
            {value.map((el, index) => {
              return (
                <Pair
                  key={el.id}
                  value={el}
                  duplicate={checkDuplicates(index)}
                  update={(v) => changeByIndex(index, v)}
                  remove={() => removeByIndex(index)}
                />
              );
            })}
          </AnimatePresence>
        </Reorder.Group>

        <Button
          theme="transparent"
          size="s"
          className="flex w-fit items-center gap-2 rounded-sm"
          onClick={addNewProperty}
        >
          <PlusIcon className="mr-1 w-4" />
          Add new
        </Button>
      </div>
    </div>
  );
};

export default RangeLabelSelector;
