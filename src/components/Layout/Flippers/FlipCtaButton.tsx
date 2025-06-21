"use client";

import { Box } from "@mui/material";

type FlipCtaButtonProps = {
  text: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
};

export default function FlipCtaButton({ text, onClick, disabled }: FlipCtaButtonProps) {
  return (
    <Box
      onClick={onClick}
      className={`group  
      cursor-pointer 
      relative 
      uppercase 
      flex 
      items-center 
      justify-center 
      bg-transparent 
      h-auto  
      w-[170px]
      transition-all 
      duration-800
      p-8
      border 
      border-red-500
      text-[12px]
      tracking-[6px]
      ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      link`}
    >
      <span className="ease absolute -left-[1px] -top-[1px] h-0 w-0 border-t-1 z-10 border-white transition-all duration-200 ease-in-out group-hover:w-full"></span>
      <span className="ease absolute -right-[1px] -top-[1px] h-0 w-0 border-r-1 z-10 border-white transition-all duration-200 ease-in-out group-hover:h-full"></span>
      <span className="ease absolute -bottom-[1px] -right-[1px] h-0 w-0 border-b-1 z-10 border-white transition-all duration-200 ease-in-out group-hover:w-full"></span>
      <span className="ease absolute -bottom-[1px] -left-[1px] h-0 w-0 border-l-1 z-10 border-white transition-all duration-200 ease-in-out group-hover:h-full"></span>

      <p className="group-hover:opacity-0 group-hover:translate-x-[-100%] absolute translate-x-0 transition-all duration-800 ease-in-out text-red-500">
        {text}
      </p>
      <p className="group-hover:translate-x-0 group-hover:opacity-100 absolute  translate-x-full opacity-0 transition-all duration-800 ease-in-out text-white">
        {text}
      </p>
    </Box>
  );
}
