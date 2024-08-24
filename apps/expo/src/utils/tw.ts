// lib/tailwind.js
import { create } from "twrnc";

import TailwindConfig from "../../tailwind.config.js";

// create the customized version...
const tw = create(TailwindConfig as any); // <- your path may differ

const tws = tw.style;
export { tw, tws };
