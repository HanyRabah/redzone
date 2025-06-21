"use client";

import clsx from "clsx";
import { Box } from "@mui/material";

type FlipButtonProps = {
  text: string;
  size?: "default" | "large";
};

export default function FlipButton({
  text,
  size = "default",
}: FlipButtonProps) {
  const textSize =
    size === "large"
      ? "text-[19px] font-semibold tracking-normal"
      : "text-[12px] font-normal tracking-[3px]";

  return (
    <Box className="overflow-hidden m-0 pointer-small h-3 relative my-2">
        <div className={clsx("font-oswald uppercase transition-all duration-300  overflow-hidden ease-out -translate-y-3 hover:translate-y-0 ", textSize)}>
          <span className="w-full block mt-0 text-[#f70000] leading-[1]">{text}</span>
          <span className="w-full block text-white leading-[1]">{text}</span>
        </div>
    </Box>
  );
}
