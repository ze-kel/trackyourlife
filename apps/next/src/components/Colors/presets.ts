import type { IColorValue } from "@tyl/validators/trackable";

const neutral = {
  lightMode: {
    h: 0,
    s: 0,
    l: 80,
  },
  darkMode: {
    h: 0,
    s: 0,
    l: 20,
  },
};

// #BD162C
const red = {
  lightMode: {
    h: 352,
    s: 79,
    l: 41,
  },
  darkMode: {
    h: 352,
    s: 79,
    l: 41,
  },
};

// #FE840E
const orange = {
  lightMode: {
    h: 30,
    s: 99,
    l: 53,
  },
  darkMode: {
    h: 30,
    s: 99,
    l: 53,
  },
};

// #58C9D4
const blue = {
  lightMode: {
    h: 185,
    s: 59,
    l: 59,
  },
  darkMode: {
    h: 185,
    s: 59,
    l: 59,
  },
};

// #BADF30
const green = {
  lightMode: {
    h: 73,
    s: 73,
    l: 53,
  },
  darkMode: {
    h: 73,
    s: 73,
    l: 53,
  },
};

// #784384
const purple = {
  lightMode: {
    h: 289,
    s: 33,
    l: 39,
  },
  darkMode: {
    h: 289,
    s: 33,
    l: 39,
  },
};

// #E290B2
const pink = {
  lightMode: {
    h: 335,
    s: 59,
    l: 73,
  },
  darkMode: {
    h: 335,
    s: 59,
    l: 73,
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
