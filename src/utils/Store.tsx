import { useEffect, useState, createContext } from "react";
import * as anchor from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { ElementalVault, IDL } from "./idl/elemental_vault";
import { Elemental } from "./elemental";
import { PublicKey } from "@solana/web3.js";

interface StoreConfig {
  elemental: Elemental | null;
}

export const StoreContext = createContext<StoreConfig>({
  elemental: null,
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const programID = new PublicKey(
    "8RTQtxytEDijzmfc1x9pxbpYSsaLMTNXDha7pmWCi2UD"
  );
  const { connection } = useConnection();

  const elementalProgram: anchor.Program<ElementalVault> =
    new anchor.Program<ElementalVault>(IDL as ElementalVault, programID!, {
      connection,
    });
  const instance = new Elemental(elementalProgram);
  const [elemental, setElemental] = useState<Elemental>(instance);
  const wallet = useAnchorWallet();

  useEffect(() => {
    const programID = new PublicKey(
      "8RTQtxytEDijzmfc1x9pxbpYSsaLMTNXDha7pmWCi2UD"
    );
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
          await instance.init();
          setElemental(instance);
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
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}
