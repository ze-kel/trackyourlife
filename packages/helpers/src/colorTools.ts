import chroma from "chroma-js";

import type {
  IColorCodingValue,
  IColorHSL,
  IColorRGB,
  IColorValue,
} from "@tyl/validators/trackable";

import { range } from "./animation";
import { presetsMap } from "./colorPresets";

// It is probably possible to write this without using a library, especially because we only need a few transforms.

export const InterpolateColors = (
  first: IColorHSL,
  second: IColorHSL,
  ratio: number,
): IColorHSL => {
  if (ratio >= 1) return second;
  if (ratio <= 0) return first;

  const c = chroma
    .mix(
      chroma.hsl(first.h, first.s / 100, first.l / 100),
      chroma.hsl(second.h, second.s / 100, second.l / 100),
      ratio,
      "rgb",
    )
    .hsl();

  return { h: Number.isNaN(c[0]) ? 0 : c[0], s: c[1] * 100, l: c[2] * 100 };
};

export const makeColorString = (color: IColorHSL) =>
  `hsl(${color.h}, ${color.s}%, ${color.l}%)`;

export const getContrastierColorForDay = ({ h, s, l }: IColorHSL) => {
  const withBlack = chroma.contrast(
    chroma.hsl(h, s / 100, l / 100),
    chroma.rgb(0, 0, 0),
  );
  const withWhite = chroma.contrast(
    chroma.hsl(h, s / 100, l / 100),
    chroma.rgb(255, 255, 255),
  );

  return withBlack > withWhite ? "black" : "white";
};

export const RGBToHSL = ({ r, g, b }: IColorRGB): IColorHSL => {
  const [h, s, l] = chroma.rgb(r, g, b).hsl();
  return { h, s: s * 100, l: l * 100 };
};

export const HSLToRGB = ({ h, s, l }: IColorHSL): IColorRGB => {
  const [r, g, b] = chroma.hsl(h, s / 100, l / 100).rgb(true);
  return { r, g, b };
};

export const makeCssGradient = (
  values: IColorCodingValue[],
  min: number,
  max: number,
  theme = "dark",
) => {
  if (!values.length) return "";

  if (values.length === 1 && values[0])
    return `linear-gradient(in srgb to right, ${makeColorString(
      theme === "light" ? values[0].color.lightMode : values[0].color.darkMode,
    )} 0%, ${makeColorString(
      theme === "light" ? values[0].color.lightMode : values[0].color.darkMode,
    )} 100%`;

  return `linear-gradient(in srgb to right, ${values
    .map(
      (v) =>
        makeColorString(
          theme === "light" ? v.color.lightMode : v.color.darkMode,
        ) +
        " " +
        range(min, max, 0, 100, v.point) +
        "%",
    )
    .join(", ")})`;
};

export const getColorAtPosition = ({
  value,
  point,
}: {
  value: IColorCodingValue[];
  point: number;
}): IColorValue => {
  if (!value.length) return presetsMap.neutral;
  if (value.length === 1 && value[0]) return value[0].color;

  let leftSide: IColorCodingValue | undefined = undefined;
  let rightSide: IColorCodingValue | undefined = undefined;

  for (const v of value) {
    if (!leftSide ?? (leftSide && v.point <= point)) {
      leftSide = v;
    }
    if (!rightSide && v.point >= point) {
      rightSide = v;
    }
  }

  if (!leftSide && rightSide) return rightSide.color;
  if (!rightSide && leftSide) return leftSide.color;
  if (!leftSide ?? !rightSide) return presetsMap.neutral;

  if (point === leftSide.point) return leftSide.color;
  if (point === rightSide.point) return rightSide.color;

  const proportion = range(leftSide.point, rightSide.point, 0, 1, point);

  return {
    lightMode: InterpolateColors(
      leftSide.color.lightMode,
      rightSide.color.lightMode,
      proportion,
    ),
    darkMode: InterpolateColors(
      leftSide.color.darkMode,
      rightSide.color.darkMode,
      proportion,
    ),
  };
};
