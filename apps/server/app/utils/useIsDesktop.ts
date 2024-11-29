import { useMediaQuery } from "usehooks-ts";

export const useIsDesktop = () => {
  return useMediaQuery("(min-width:768px)", {
    initializeWithValue: false,
  });
};
