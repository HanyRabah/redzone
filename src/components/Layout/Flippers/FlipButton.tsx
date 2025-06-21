
import { Box } from '@mui/material';
import FlipText from './FlipText';

type FlipButtonProps = {
  text: string;
  onClick?: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
};

export default function FlipButton({
  text,
  onClick,
  isActive,
  isDisabled,
}: FlipButtonProps) {

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
       transform: isActive ? 'scale(1.3)' : 'scale(1)',
      }}
      className="inline-block overflow-hidden" 
    >
      <FlipText
        text={text}
        size="xl"
        fontWeight="bold"
        isActive={isActive}
        isDisabled={isDisabled}
      />
    </Box>
  );
}
