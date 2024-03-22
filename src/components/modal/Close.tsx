import React, { FC } from "react";
import {
  accountForDecimal,
  handleErrors,
  handleSuccess,
} from "../../utils/function";
import Button from "../Button";
import { Transaction } from "@solana/web3.js";
import { useStoreContext } from "../../utils/useStoreContext";

interface IProps {
  setFundTab: (value: React.SetStateAction<number>) => void;
  handleInputChange: (inputValue: number) => void;
  vaultBalance: number;
}

const Close: FC<IProps> = ({ setFundTab, handleInputChange, vaultBalance }) => {
  const { elemental } = useStoreContext();

  const handleClose = async () => {
    try {
      // CHECK IF VAULT END DATE HAS PASS
      if (
        elemental &&
        elemental.selectedVault &&
        elemental.selectedVault.vault &&
        elemental.wallet
      ) {
        const ix = await elemental.closeVaultIx(
          elemental.selectedVault.fund.vault
        );
        if (ix) {
          const tx = new Transaction().add(ix);
          const signature = await elemental.signAndSendTransaction(tx);
          handleSuccess(signature);
          setFundTab(0);
        } else {
          throw Error("Error with constructing of user withdraw ix");
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      handleErrors(err);
    }
  };

  return (
    <div className="deposit">
      <div className="subTabHeader">
        <h2>Close Vault</h2>
        <button onClick={() => setFundTab(0)}>Cancel</button>
      </div>
      <div className="subTabContent">
        <div className="subTabActions">
          <p>Amount in vault: {accountForDecimal(+vaultBalance)}</p>
          <Button
            onClick={() => handleClose()}
            // disabled={
            //   +elemental.selectedVault.vault!.endDate +
            //     +elemental.selectedVault.vault!.withdrawTimeframe >
            //   Date.now()
            // }
          >
            Close
          </Button>
        </div>
        <div className="subTabInfo">
          <h2>Notes</h2>
          <p
            onClick={() =>
              handleInputChange(
                Number(
                  +elemental.selectedVault.vault!.amountCollected -
                    +elemental.selectedVault.vault!.amountRedeemed
                )
              )
            }
          >
            * Closable after:{" "}
            {
              <p>
                <span className="icon clock" />
                {new Date(
                  Number(
                    +elemental.selectedVault.vault!.endDate +
                      +elemental.selectedVault.vault!.withdrawTimeframe
                  )
                )
                  .toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: true, // Optional: Change to false for 24-hour format
                  })
                  .replace("am", "AM")
                  .replace("pm", "PM")}{" "}
                (Local Time)
              </p>
            }
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Close;
