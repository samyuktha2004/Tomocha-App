"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider@1.2.3";

import { cn } from "./utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max],
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-white/30 dark:bg-white/20 relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5 backdrop-blur-sm",
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-gradient-to-r from-[#C855E7] via-[#E91E8C] to-[#FF66CC] dark:from-[#D06BF0] dark:via-[#F03399] dark:to-[#FF7AD4] absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full",
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="block size-6 shrink-0 rounded-full border-2 border-white dark:border-white/90 shadow-lg transition-[transform,box-shadow] hover:scale-110 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-[#C855E7] via-[#E91E8C] to-[#FF66CC] dark:from-[#D06BF0] dark:via-[#F03399] dark:to-[#FF7AD4]"
          style={{
            boxShadow: '0 0 24px rgba(232, 30, 140, 0.7), 0 0 48px rgba(232, 30, 140, 0.4), 0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
