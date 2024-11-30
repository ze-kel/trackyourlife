import { useMediaQuery } from "usehooks-ts";

export const useIsDesktop = () => {
  return useMediaQuery("(min-width:768px)", {
    initializeWithValue: false,
  });
};

export const useIsMobile = () => {
  const isMobile = useMediaQuery("(max-width:767px)", {
    initializeWithValue: false,
  });
  return isMobile;
};
