import { useState } from "react";
import emojiRegex from "emoji-regex";
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";
import { GripHorizontalIcon, PlusIcon, XIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import type { ArrayElement } from "@tyl/validators/helpers";
import type { IColorValue, IRangeSettings } from "@tyl/validators/trackable";
import { cloneDeep } from "@tyl/helpers";

import { Button } from "~/@shad/components/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/@shad/components/hover-card";
import { Input } from "~/@shad/components/input";
import ColorInput from "~/components/Colors/colorInput";

export interface IRangeLabelSelector {
  initialValue: IRangeSettings["labels"];
  onChange: (a: IRangeSettings["labels"]) => void;
}

type IRangeLabel = ArrayElement<NonNullable<IRangeSettings["labels"]>>;

const regex = emojiRegex();

const Entry = ({
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

  const updateKey = (internalKey: string) => {
    update({ ...value, internalKey });
  };

  const updateColor = (color: IColorValue) => {
    update({ ...value, color });
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
      dragListener={false}
      dragControls={controls}
      className="relative flex items-center gap-2"
      layout
    >
      <Input
        value={value.internalKey}
        className={"col-start-1 col-end-1 w-64"}
        error={duplicate || !value.internalKey}
        onChange={(e) => updateKey(e.target.value)}
      />

      <HoverCard>
        <HoverCardTrigger>
          <Input
            value={value.emoji}
            onChange={(e) => selectEmoji(e.target.value)}
            className="w-10"
          />
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="">
            Type new emoji. Hotkeys:
            <span className="block"> Windows key + .</span>{" "}
            <span className="block">Command + Control + Space.</span>
          </div>
        </HoverCardContent>
      </HoverCard>

      <ColorInput value={value.color} onChange={updateColor}></ColorInput>

      <div className="cursor-grab" onPointerDown={(e) => controls.start(e)}>
        <GripHorizontalIcon className="text-neutral-300 transition-colors hover:text-neutral-800 dark:text-neutral-700 dark:hover:text-neutral-100" />
      </div>

      <div
        className="flex w-7 cursor-pointer items-center justify-center"
        onClick={remove}
      >
        <XIcon className="text-neutral-300 transition-colors hover:text-neutral-800 dark:text-neutral-700 dark:hover:text-neutral-100" />
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
  const [value, updateValue] = useState(addIds(initialValue));
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

  const updateAndPush: IRangeLabelSelector["onChange"] = (value = []) => {
    updateValue(value);
    pushUpdates(value);
  };

  const changeByIndex = (index: number, v: IRangeLabel) => {
    const upd = cloneDeep(value);

    upd[index] = v;
    updateValue(upd);
    pushUpdates(upd);
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
            <div className="w-64">Value</div>
            <div>Icon</div>
            <div></div>
          </div>
        )}

        <Reorder.Group
          as="div"
          axis="y"
          values={value}
          onReorder={updateAndPush}
          layout
          transition={{ duration: 0.1 }}
        >
          <AnimatePresence initial={false}>
            {value.map((el, index) => {
              return (
                <Entry
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
          variant="outline"
          className="flex w-fit items-center gap-2"
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
