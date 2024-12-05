import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { cn } from "~/@shad/utils";
import {
  ControllerPoint,
  ControllerRoot,
} from "~/components/Colors/dragController";

export const Route = createFileRoute("/app/testing")({
  component: RouteComponent,
});

const classesHor = cn(
  "h-full w-2.5 rounded-lg border-2 border-neutral-800 opacity-50 ring-2 ring-neutral-200",
  "dark:border-neutral-200 dark:ring-neutral-800",
  "data-[selected=true]:opacity-100",
  "data-[active=false]:w-1.5 data-[active=false]:border",
);

const classesVer = cn(
  "h-10 w-10 rounded-lg border-2 border-neutral-800 opacity-50 ring-2 ring-neutral-200",
  "dark:border-neutral-200 dark:ring-neutral-800",
  "data-[selected=true]:opacity-100",
  "data-[active=false]:w-1.5 data-[active=false]:border",
);

function RouteComponent() {
  const [value, setValue] = useState(10);
  const [value2, setValue2] = useState(50);

  const value2L = value2 / 2;

  const [value3, setValue3] = useState({ x: 10, y: 10 });
  const [value4, setValue4] = useState({ x: 50, y: 50 });
  const value4L = { x: value4.x / 2, y: value4.y / 2 };

  return (
    <div>
      <ControllerRoot
        xMax={100}
        disableY
        initialSelectedPointId="1"
        className="h-[50px] w-[500px] bg-red-500"
      >
        <ControllerPoint
          id="1"
          x={value}
          onValueChange={(v) => setValue(v.x)}
          className={classesHor}
        ></ControllerPoint>
        <ControllerPoint
          id="2"
          x={value2}
          onValueChange={(v) => setValue2(v.x)}
          className={classesHor}
        ></ControllerPoint>
        <ControllerPoint
          id="3"
          x={value2L}
          className={classesHor}
        ></ControllerPoint>
      </ControllerRoot>

      <ControllerRoot
        xMax={100}
        yMax={100}
        initialSelectedPointId="1"
        className="mt-2 h-[500px] w-[500px] bg-red-500"
      >
        <ControllerPoint
          id="1"
          x={value3.x}
          y={value3.y}
          onValueChange={(v) => setValue3(v)}
          className={classesVer}
        ></ControllerPoint>
        <ControllerPoint
          id="2"
          x={value4.x}
          y={value4.y}
          onValueChange={(v) => setValue4(v)}
          className={classesVer}
        ></ControllerPoint>
        <ControllerPoint
          id="3"
          {...value4L}
          className={classesVer}
        ></ControllerPoint>
      </ControllerRoot>
    </div>
  );
}
