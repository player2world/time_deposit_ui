import { useEffect, useState, createContext } from "react";
import * as anchor from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { ElementalVault, IDL } from "./idl/elemental_vault";
import { Elemental } from "./elemental";
import { PublicKey } from "@solana/web3.js";
import { UserInfoStruct } from "./types";

interface StoreConfig {
  elemental: Elemental | null;
  userInfo: UserInfoStruct | undefined;
  setUserInfo: (x: UserInfoStruct) => void;
  vaultBalance: number;
  setVaultBalance: (x: number) => void;
  isLoading: boolean;
  setIsLoading: (x: boolean) => void;
}

export const StoreContext = createContext<StoreConfig>({
  elemental: null,
  userInfo: undefined,
  setUserInfo: () => {},
  vaultBalance: 0,
  setVaultBalance: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const programID = new PublicKey(import.meta.env.VITE_PROGRAM_ID);
  const { connection } = useConnection();

  const elementalProgram: anchor.Program<ElementalVault> =
    new anchor.Program<ElementalVault>(IDL as ElementalVault, programID!, {
      connection,
    });
  const instance = new Elemental(elementalProgram);
  const [elemental, setElemental] = useState<Elemental>(instance);
  const [userInfo, setUserInfo] = useState<UserInfoStruct | undefined>(
    elemental.userSelectedDepositInfo
  );
  const [vaultBalance, setVaultBalance] = useState<number>(
    +elemental.selectedVaultBalance
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const wallet = useAnchorWallet();

  useEffect(() => {
    const programID = new PublicKey(import.meta.env.VITE_PROGRAM_ID);
    (async () => {
      try {
        if (!IDL) {
          throw "IDL File Required";
        }
        if (!programID) {
          throw "ProgramID Required";
        }

        if (wallet && wallet.publicKey) {
          const provider = new anchor.AnchorProvider(
            connection,
            wallet,
            anchor.AnchorProvider.defaultOptions()
          );
          anchor.setProvider(provider);
          const elementalProgram: anchor.Program<ElementalVault> =
            new anchor.Program<ElementalVault>(
              IDL as ElementalVault,
              programID!,
              provider
            );
          const instance = new Elemental(elementalProgram, wallet);
          setIsLoading(true);
          await instance.init();
          setElemental(instance);
          setUserInfo(instance.userSelectedDepositInfo);
          setVaultBalance(+instance.selectedVaultBalance);
          setIsLoading(false);
        } else {
          const elementalProgram: anchor.Program<ElementalVault> =
            new anchor.Program<ElementalVault>(
              IDL as ElementalVault,
              programID!,
              { connection }
            );
          const instance = new Elemental(elementalProgram);
          await instance.init();
          setElemental(instance);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [connection, wallet]);

  return (
    <StoreContext.Provider
      value={{
        elemental: elemental!,
        userInfo,
        setUserInfo,
        vaultBalance,
        setVaultBalance,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
