import React, { FC } from "react";
import { handleErrors, handleSuccess } from "../../utils/function";
import Button from "../Button";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useStoreContext } from "../../utils/useStoreContext";

interface IProps {
  setFundTab: (value: React.SetStateAction<number>) => void;
  setToAddress: React.Dispatch<React.SetStateAction<string>>;
  toAddress: string;
}
const TransferAdmin: FC<IProps> = ({ setFundTab, setToAddress, toAddress }) => {
  const { elemental } = useStoreContext();

  const handleTransferAdmin = async () => {
    try {
      if (
        elemental &&
        elemental.selectedVault &&
        elemental.selectedVault.vault &&
        elemental.wallet &&
        toAddress
      ) {
        // CHECK ADMIN WHITELIST

        const ix = await elemental.updateVaultAuthorityIx(
          elemental.selectedVault.fund.vault,
          new PublicKey(toAddress)
        );
        if (ix) {
          const tx = new Transaction().add(ix);
          const signature = await elemental.signAndSendTransaction(tx);
          handleSuccess(signature);
        } else {
          throw Error("Error with constructing of update vault authority ix");
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
        <h2>Transfer Admin</h2>
        <button onClick={() => setFundTab(0)}>Cancel</button>
      </div>
      <div className="subTabContent">
        <div className="subTabActions">
          <h3>How can you transfer admin?</h3>
          <p>Transfer Admin</p>
          <input
            type="text"
            name="toAddress"
            value={toAddress}
            placeholder="New admin address"
            className="inputBox ease-in-out"
            onChange={(e) => setToAddress(e.target.value)}
          />
          <Button onClick={() => handleTransferAdmin()}>Transfer Admin</Button>
        </div>
        <div className="subTabInfo">
          <h2>Hello there</h2>
          <p>Here is where we add all the additional info desired</p>
          <p>Be careful, the boogeyman is coming!</p>
        </div>
      </div>
    </div>
  );
};

export default TransferAdmin;
