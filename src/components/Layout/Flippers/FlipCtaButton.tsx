"use client";

import { Link } from "@mui/material";

type FlipCtaButtonProps = {
  text: string;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  disabled?: boolean;
  color?: 'white' | 'red';
};

export default function FlipCtaButton({ text, onClick, href, disabled, color = "white" }: FlipCtaButtonProps) {
  const borderColor = color === "white" ? "border-white" : "border-red-500";
  const textColor = color === "white" ? "text-white" : "text-red-500";
  const hoverBorderColor = color === "white" ? "border-red-500" : "border-white";
  const hoverTextColor = color === "white" ? "text-red-500" : "text-white";

  return (
    <Link
      onClick={(e) => onClick && onClick(e)}
      href={href || "#"}
      className={`group  
      cursor-pointer 
      relative 
      uppercase 
      flex 
      items-center 
      justify-center 
      bg-transparent 
      h-auto  
      w-[120px]
      md:w-[170px]
      transition-all 
      duration-800
      p-6
      md:p-8
      border 
      ${borderColor}
      text-[12px]
      tracking-[6px]
      ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      link`}
    >
      <span className={`ease absolute -left-[1px] -top-[1px] h-0 w-0 border-t-1 z-10 ${hoverBorderColor} transition-all duration-200 ease-in-out group-hover:w-full`}></span>
      <span className={`ease absolute -right-[1px] -top-[1px] h-0 w-0 border-r-1 z-10 ${hoverBorderColor} transition-all duration-200 ease-in-out group-hover:h-full`}></span>
      <span className={`ease absolute -bottom-[1px] -right-[1px] h-0 w-0 border-b-1 z-10 ${hoverBorderColor} transition-all duration-200 ease-in-out group-hover:w-full`}></span>
      <span className={`ease absolute -bottom-[1px] -left-[1px] h-0 w-0 border-l-1 z-10 ${hoverBorderColor} transition-all duration-200 ease-in-out group-hover:h-full`}></span>

      <p className={`group-hover:opacity-0 group-hover:translate-x-[-100%] absolute translate-x-0 transition-all duration-800 ease-in-out ${textColor}`}>
        {text}
      </p>
      <p className={`group-hover:translate-x-0 group-hover:opacity-100 absolute  translate-x-full opacity-0 transition-all duration-800 ease-in-out ${hoverTextColor}`}>
        {text}
      </p>
    </Link>
  );
}
