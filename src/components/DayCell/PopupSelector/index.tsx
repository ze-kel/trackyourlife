import { Emoji } from "@components/_UI/Emoji";
import type { IRangeSettings } from "@t/trackable";

interface PopupSelectorProps {
  rangeMapping: IRangeSettings["labels"];
  onSelect: (v: string) => Promise<void>;
}

const PopupSelector = ({ rangeMapping, onSelect }: PopupSelectorProps) => {
  if (!rangeMapping || !rangeMapping.length) return <></>;

  return (
    <div className="absolute top-1/2 left-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col rounded-full dark:bg-neutral-800">
      {rangeMapping.map((v, index) => {
        return (
          <div
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              void onSelect(v.internalKey);
            }}
            className="rounded-full px-1 transition-colors hover:bg-lime-500"
          >
            <Emoji size="20px" shortcodes={v.emojiShortcode} />
          </div>
        );
      })}
    </div>
  );
};

export default PopupSelector;
