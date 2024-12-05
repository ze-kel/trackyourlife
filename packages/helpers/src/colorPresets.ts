import type { IColorValue } from "@tyl/validators/trackable";

import { findClosestDarkmode, findClosestLightmode } from "./colorTools";

const neutral_base = {
  h: 0,
  s: 0,
  l: 80,
};

const neutral = {
  lightMode: findClosestLightmode(neutral_base),
  darkMode: findClosestDarkmode(neutral_base),
  userSelect: neutral_base,
};

const red_base = {
  h: 352,
  s: 79,
  l: 41,
};

const red = {
  lightMode: findClosestLightmode(red_base),
  darkMode: findClosestDarkmode(red_base),
  userSelect: red_base,
};

const orange_base = {
  h: 30,
  s: 99,
  l: 53,
};

const orange = {
  lightMode: findClosestLightmode(orange_base),
  darkMode: findClosestDarkmode(orange_base),
  userSelect: orange_base,
};

const blue_base = {
  h: 185,
  s: 59,
  l: 59,
};

const blue = {
  lightMode: findClosestLightmode(blue_base),
  darkMode: findClosestDarkmode(blue_base),
  userSelect: blue_base,
};

const green_base = {
  h: 73,
  s: 73,
  l: 53,
};

const green = {
  lightMode: findClosestLightmode(green_base),
  darkMode: findClosestDarkmode(green_base),
  userSelect: green_base,
};

const purple_base = {
  h: 289,
  s: 33,
  l: 39,
};

const purple = {
  lightMode: findClosestLightmode(purple_base),
  darkMode: findClosestDarkmode(purple_base),
  userSelect: purple_base,
};

const pink_base = {
  h: 335,
  s: 59,
  l: 73,
};

const pink = {
  lightMode: findClosestLightmode(pink_base),
  darkMode: findClosestDarkmode(pink_base),
  userSelect: pink_base,
};

export const presetsMap = {
  red,
  orange,
  green,
  blue,
  purple,
  pink,
  neutral,
};
export const presetsArray: IColorValue[] = [
  neutral,
  red,
  orange,
  green,
  purple,
  pink,
];
