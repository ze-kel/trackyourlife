import type { IColorValue } from "@t/trackable";

const neutral = {
  lightMode: {
    hue: 0,
    saturation: 0,
    lightness: 80,
  },
  darkMode: {
    hue: 0,
    saturation: 0,
    lightness: 20,
  },
};

// #BD162C
const red = {
  lightMode: {
    hue: 352,
    saturation: 79,
    lightness: 41,
  },
  darkMode: {
    hue: 352,
    saturation: 79,
    lightness: 41,
  },
};

// #FE840E
const orange = {
  lightMode: {
    hue: 30,
    saturation: 99,
    lightness: 53,
  },
  darkMode: {
    hue: 30,
    saturation: 99,
    lightness: 53,
  },
};

// #58C9D4
const blue = {
  lightMode: {
    hue: 185,
    saturation: 59,
    lightness: 59,
  },
  darkMode: {
    hue: 185,
    saturation: 59,
    lightness: 59,
  },
};

// #BADF30
const green = {
  lightMode: {
    hue: 73,
    saturation: 73,
    lightness: 53,
  },
  darkMode: {
    hue: 73,
    saturation: 73,
    lightness: 53,
  },
};

// #784384
const purple = {
  lightMode: {
    hue: 289,
    saturation: 33,
    lightness: 39,
  },
  darkMode: {
    hue: 289,
    saturation: 33,
    lightness: 39,
  },
};

// #E290B2
const pink = {
  lightMode: {
    hue: 335,
    saturation: 59,
    lightness: 73,
  },
  darkMode: {
    hue: 335,
    saturation: 59,
    lightness: 73,
  },
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
