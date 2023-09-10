import { Input } from "@/components/ui/input";
import type { INumberSettings } from "@t/trackable";
import cloneDeep from "lodash/cloneDeep";
import ColorSelector from "./colorSelector";
import XIcon from "@heroicons/react/24/outline/XMarkIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import { Fragment, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { ArrayElement } from "@t/helpers";
import { AnimatePresence, motion } from "framer-motion";

type IColorCodingValue = INumberSettings["colorCoding"];

type IColorCodingItem = ArrayElement<NonNullable<IColorCodingValue>>;

interface INumberColorSelectorPair {
  value: IColorCodingItem;
  onChange: (v: IColorCodingItem) => void;
  remove: () => void;
}

const Pair = ({ value, onChange, remove }: INumberColorSelectorPair) => {
  const [fromInternal, setFromInternal] = useState<number>(value.from);
  const [error, setError] = useState(false);

  const changeVal = (v: number) => {
    setFromInternal(v);
    if (!Number.isNaN(v)) {
      onChange({ ...value, from: v });
      setError(false);
    } else {
      setError(true);
    }
  };

  const changeColor = (v: IColorCodingItem["color"]) => {
    onChange({ ...value, color: v });
  };

  const removeIfEmpty = () => {
    if (Number.isNaN(fromInternal)) {
      remove();
    }
  };

  return (
    <motion.div
      layout
      transition={{
        duration: 0.25,
        opacity: { duration: 0.2, ease: "circIn" },
      }}
      initial={{ opacity: 0, y: 10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "36px" }}
      exit={{ opacity: 0, height: 0, zIndex: -99 }}
      className="flex items-center gap-2"
    >
      <Input
        type={"number"}
        value={String(fromInternal)}
        onChange={(v) => changeVal(v.target.valueAsNumber)}
        className="w-52"
        error={error}
        onBlur={removeIfEmpty}
      />
      <ColorSelector active={value.color} onChange={(v) => changeColor(v)} />
      <div
        className="flex w-7 cursor-pointer items-center justify-center"
        onClick={remove}
      >
        <XIcon className="w-7 text-neutral-300 transition-colors hover:text-neutral-800  dark:text-neutral-700 dark:hover:text-neutral-100" />
      </div>
    </motion.div>
  );
};

const addIds = (value: IColorCodingValue = []) => {
  const v2 = cloneDeep(value);

  v2.forEach((item) => {
    if (!item.id) {
      item.id = uuidv4();
    }
  });
  return v2;
};

export interface INumberColorSelector {
  initialValue: IColorCodingValue;
  onChange: (a: IColorCodingValue) => void;
}

const NumberColorSelector = ({
  initialValue,
  onChange,
}: INumberColorSelector) => {
  const [value, updateValue] = useState(addIds(initialValue) || []);

  const recordUpdate = (value: IColorCodingValue = []) => {
    const sorted = cloneDeep(value).sort((a, b) => a.from - b.from);
    updateValue(sorted);
    onChange(sorted);
  };

  const addNew = () => {
    const v2 = cloneDeep(value);
    const before = v2[v2.length - 1];
    const from = before ? before.from + 1 : 0;
    v2.push({ from, color: "neutral", id: uuidv4() });
    recordUpdate(v2);
  };

  const chagneByIndex = (i: number, v: IColorCodingItem) => {
    const v2 = cloneDeep(value);
    try {
      v2[i] = v;
      recordUpdate(v2);
    } catch (e) {
      throw new Error("Invalid index");
    }
  };

  const removeByIndex = (i: number) => {
    const v2 = cloneDeep(value);
    v2.splice(i, 1);
    recordUpdate(v2);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-fit flex-col items-center gap-2">
        <div className="flex w-full gap-2 text-neutral-400 dark:text-neutral-500">
          {value.length > 0 && (
            <>
              <div className="w-52 ">When value {">="} than</div>
              <div>Set color to</div>
              <div></div>
            </>
          )}
        </div>
        <motion.div
          layout
          transition={{ duration: 0.1 }}
          className="flex flex-col gap-2"
        >
          <AnimatePresence initial={false}>
            {value.map((el, index) => {
              return (
                <Pair
                  value={el}
                  onChange={(v: IColorCodingItem) => chagneByIndex(index, v)}
                  remove={() => removeByIndex(index)}
                  key={el.id || ""}
                />
              );
            })}
          </AnimatePresence>
        </motion.div>
        <div
          className="flex cursor-pointer justify-center whitespace-nowrap text-neutral-300 transition-colors hover:text-neutral-800 dark:text-neutral-700 dark:hover:text-neutral-100"
          onClick={() => addNew()}
        >
          <PlusIcon className="mr-1 w-4" />
          Add new
        </div>
      </div>
    </div>
  );
};

export default NumberColorSelector;
