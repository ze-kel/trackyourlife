import { PureInput } from "@components/_UI/Input";
import type { IColorOptions, INumberSettings } from "@t/trackable";
import { clamp, cloneDeep } from "lodash";
import ColorSelector from "./colorSelector";
import XIcon from "@heroicons/react/24/outline/XMarkIcon";

export interface IRangeColorSelectorProps {
  value: INumberSettings["colorCoding"];
  onChange: (a: INumberSettings["colorCoding"]) => void;
}

const RangeColorSelector = ({ value, onChange }: IRangeColorSelectorProps) => {
  const v = value || [];
  const addNew = (index = 0) => {
    const v2 = cloneDeep(v);

    const before = v2[index - 1];
    const from = before ? before.from + 1 : 0;

    v2.splice(index, 0, { from, color: "neutral" });
    onChange(v2);
  };

  const changeValIndex = (index: number, val: number) => {
    if (Number.isNaN(val)) return;
    const v2 = cloneDeep(v);
    const target = v2[index];
    if (!target) throw new Error("Wrong index");
    const before = v2[index - 1];
    const after = v2[index + 1];

    const limitFrom = before ? before.from : -Infinity;
    const limitTo = after ? after.from : Infinity;

    target.from = clamp(val, limitFrom, limitTo);
    onChange(v2);
  };

  const changeColorIndex = (index: number, val: IColorOptions | undefined) => {
    if (!val) return;
    const v2 = cloneDeep(v);
    const target = v2[index];
    if (!target) throw new Error("Wrong index");
    target.color = val;
    onChange(v2);
  };

  return (
    <div className="flex flex-col gap-2">
      {v.map((el, index) => {
        return (
          <div key={index} className="flex items-center gap-3">
            <PureInput
              type={"number"}
              value={String(el.from)}
              onChange={(v) => changeValIndex(index, Number(v.target.value))}
              className="w-40"
            />
            <ColorSelector
              active={el.color}
              onChange={(v) => changeColorIndex(index, v)}
            />
            <XIcon className="w-6" />
          </div>
        );
      })}
      <div onClick={() => addNew(v.length)}>addhere</div>
    </div>
  );
};

export default RangeColorSelector;
