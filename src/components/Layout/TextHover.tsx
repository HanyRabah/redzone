import { Typography } from "@mui/material";

interface TextHoverProps {
    text: string;
    isHovered: boolean;
    className?: string;
}

const TextHover = ({text, isHovered, className}: TextHoverProps) => {

  return (
    <div className={`h-5 relative overflow-hidden ${className}`}>
      {/* Container for both text elements */}
      <div
        className="transition-transform duration-300 ease-in-out h-5"
        style={{
          transform: isHovered ? "translateY(0)" : "translateY(-100%)",
        }}
      >
        {/* Hover text */}
        <div className="h-6 flex items-center justify-center">
          <Typography className="text-red-500 text-[12px] text-center uppercase tracking-[0.3em] font-semibold">
            {text}
          </Typography>
        </div>

        {/* Default text */}
        <div className="h-6 flex items-center justify-center -mt-2">
          <Typography className="text-white text-[12px] text-center uppercase tracking-[0.3em] font-semibold">
            {text}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default TextHover;
