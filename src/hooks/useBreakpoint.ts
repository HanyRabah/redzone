import tailwindConfig from '../../tailwind.config';
import createBreakpoint from '../lib/createBreakPoints';

// Define the type for our breakpoints
interface ScreenSizes {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  [key: string]: string | number; // For any additional breakpoints
}

// Default screen sizes if not provided in Tailwind config
const DEFAULT_SCREENS: ScreenSizes = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

// Type guard to check if screens is a function
const isFunction = (value: unknown): value is (options: unknown) => ScreenSizes => {
  return typeof value === 'function';
};

// Safely get screens from Tailwind config
const getScreens = (): ScreenSizes => {
  const { theme } = tailwindConfig as { theme?: { screens?: unknown } };
  
  if (!theme?.screens) {
    return DEFAULT_SCREENS;
  }

  // Handle case where screens is a function
  if (isFunction(theme.screens)) {
    try {
      const result = theme.screens({});
      return { ...DEFAULT_SCREENS, ...result } as ScreenSizes;
    } catch {
      return DEFAULT_SCREENS;
    }
  }

  // Handle case where screens is an object
  if (typeof theme.screens === 'object' && theme.screens !== null) {
    return { ...DEFAULT_SCREENS, ...theme.screens } as ScreenSizes;
  }

  return DEFAULT_SCREENS;
};

const screens = getScreens();

// Convert pixel string to number (e.g., '768px' -> 768)
const parseScreenSize = (size: string | number): number => {
  if (typeof size === 'number') return size;
  return parseInt(size.replace('px', ''), 10) || 0;
};

export type Breakpoint = keyof typeof breakpoints;

export const breakpoints = {
  phone: 0,
  tablet: parseScreenSize(screens.md),
  laptop: parseScreenSize(screens.lg),
  desktop: parseScreenSize(screens.xl),
};

const useBreakpoint = createBreakpoint(breakpoints) as () => Breakpoint;
export default useBreakpoint;
