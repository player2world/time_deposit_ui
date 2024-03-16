import { useContext } from "react";
import { StoreContext } from "./Store";

export const useStoreContext = () => {
  const context = useContext(StoreContext);

  return {
    elemental: context.elemental!,
    userInfo: context.userInfo,
    setUserInfo: context.setUserInfo,
    vaultBalance: context.vaultBalance,
    setVaultBalance: context.setVaultBalance,
    isLoading: context.isLoading,
    setIsLoading: context.setIsLoading,
  };
};
