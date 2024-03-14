import { useContext } from "react";
import { StoreContext } from "./Store";

export const useStoreContext = () => {
  const context = useContext(StoreContext);

  return {
    elemental: context.elemental!,
  };
};
