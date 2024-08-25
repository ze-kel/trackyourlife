"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import { cn } from ".";

const RadioTabs = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn(
        "flex h-11 items-center justify-center rounded-lg bg-neutral-100 p-1 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400",
        className,
      )}
      {...props}
      ref={ref}
    />
  );
});
RadioTabs.displayName = RadioGroupPrimitive.Root.displayName;

const RadioTabItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "inline-flex h-full items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=checked]:bg-white data-[state=checked]:text-neutral-950 data-[state=checked]:shadow dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 dark:data-[state=checked]:bg-neutral-950 dark:data-[state=checked]:text-neutral-50",
        className,
      )}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Item>
  );
});
RadioTabItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioTabs, RadioTabItem };
