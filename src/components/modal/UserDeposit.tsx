import React, { FC } from "react";
import {
  accountForDecimal,
  handleErrors,
  handleSuccess,
} from "../../utils/function";
import Button from "../Button";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Transaction } from "@solana/web3.js";
import { useStoreContext } from "../../utils/useStoreContext";

interface IProps {
  setFundTab: (value: React.SetStateAction<number>) => void;
  minAmount: number;
  vaultCapacity: number;
  amountCollected: number;
  multiple: number;
  currentValue: number;
  isValidMultiple: boolean;
  handleInputChange: (inputValue: number) => void;
}

const UserDeposit: FC<IProps> = ({
  setFundTab,
  handleInputChange,
  minAmount,
  vaultCapacity,
  amountCollected,
  isValidMultiple,
  multiple,
  currentValue,
}) => {
  const wallet = useAnchorWallet();
  const { elemental, setUserInfo, setVaultBalance, setIsLoading } =
    useStoreContext();

  // USER DEPOSIT
  const handleDeposit = async (amount: number) => {
    try {
      // CHECK IF ALL REQUIRED STATES ARE IN PLACE
      if (
        elemental &&
        elemental.selectedVault &&
        elemental.selectedVault.vault &&
        elemental.wallet &&
        !(amount % accountForDecimal(+elemental.selectedVault.vault.minAmount))
      ) {
        // GET AMOUNT TO DEPOSIT BASE ON AVAILABLE POOL
        const ix = await elemental.initOrDepositUserIx(
          elemental.selectedVault.fund.vault,
          amount
        );
        // CREATE DEPOSIT TX
        if (ix && wallet) {
          const tx = new Transaction().add(ix);
          const signature = await elemental.signAndSendTransaction(tx);
          handleSuccess(signature);
          setIsLoading(true);
          setFundTab(0);
          await elemental.confirmTransaction(signature);
          const ele = await elemental.refreshState();
          setUserInfo(ele.userSelectedDepositInfo!);
          setVaultBalance(ele.selectedVaultBalance);
          setIsLoading(false);
        } else {
          throw Error("Error with constructing of init or deposit IX");
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
        <h2>Deposit Funds</h2>
        <button onClick={() => setFundTab(0)}>Cancel</button>
      </div>
      <div className="subTabContent">
        <div className="subTabActions">
          <h3>How much are you depositing?</h3>
          <p>
            Available Amount:{" "}
            {(
              elemental.selectedVaultUserBaseBalance /
              10 ** elemental.selectedVault.fund.decimalPlace
            ).toFixed(2)}{" "}
            {elemental.selectedVault.fund.token}
          </p>

          <input
            type="number"
            name="depositAmount"
            min={minAmount}
            max={
              accountForDecimal(vaultCapacity) -
              accountForDecimal(amountCollected)
            }
            step={multiple}
            placeholder={`Multiples of ${minAmount}`}
            className="inputBox ease-in-out"
            value={currentValue.toString()}
            onChange={(e) => handleInputChange(Number(e.target.value))}
            //prettify acting up
          />
          <Button
            onClick={() => handleDeposit(currentValue)}
            disabled={!isValidMultiple}
          >
            Deposit
          </Button>
        </div>
        <div className="subTabInfo">
          <h2>Notes</h2>
          <p>* Deposit in multiples of {minAmount}.</p>
          <p>* Max deposit of {vaultCapacity - amountCollected}.</p>
          <p>
            * The deposited amount will only start accruing interest on vault
            activation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDeposit;
