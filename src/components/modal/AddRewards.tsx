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
  vaultBalance: number;
  currentValue: number;
  handleInputChange: (inputValue: number) => void;
}

const AddRewards: FC<IProps> = ({
  setFundTab,
  handleInputChange,
  vaultBalance,
  currentValue,
}) => {
  const { elemental, setUserInfo, setVaultBalance, setIsLoading } =
    useStoreContext();

  // AUTHORITY TOPUP
  const handleTopup = async (amount: number) => {
    try {
      // CHECK IF ALL REQUIRED STATES ARE IN PLACE
      if (
        elemental &&
        elemental.selectedVault &&
        elemental.selectedVault.vault &&
        elemental.wallet &&
        amount
      ) {
        // GET AMOUNT TO DEPOSIT BASE ON AVAILABLE POOL
        const ix = await elemental.transferToVaultIx(
          elemental.selectedVault.fund.vault,
          amount * 10 ** elemental.selectedVault.fund.decimalPlace
        );
        // CREATE DEPOSIT TX
        if (ix) {
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
        <h2>Add Reward</h2>
        <button onClick={() => setFundTab(0)}>Cancel</button>
      </div>
      <div className="subTabContent">
        <div className="subTabActions">
          <h3>How much are you topping up?</h3>
          <p>
            Current balance: {accountForDecimal(vaultBalance)}{" "}
            {elemental.selectedVault.fund.token}
          </p>

          <input
            type="number"
            name="depositAmount"
            className="inputBox ease-in-out"
            value={currentValue.toString()}
            onChange={(e) => handleInputChange(Number(e.target.value))}
            //prettify acting up
          />
          <Button
            onClick={() => handleTopup(currentValue)}
            disabled={currentValue === 0}
          >
            Deposit
          </Button>
        </div>
        <div className="subTabInfo">
          <h2>Notes</h2>
          <p>
            * Expected deposit amount with yield{" "}
            {accountForDecimal(
              elemental.getUserWithdrawAmountWithYield(
                +elemental.selectedVault.vault!.amountCollected -
                  +elemental.selectedVault.vault!.amountRedeemed
              )
            ).toFixed(2)}
            .
          </p>
          <p
            onClick={() =>
              handleInputChange(
                Number(
                  Math.ceil(
                    accountForDecimal(
                      elemental.getUserWithdrawAmountWithYield(
                        +elemental.selectedVault.vault!.amountCollected -
                          +elemental.selectedVault.vault!.amountRedeemed
                      ) - elemental.selectedVaultBalance
                    )
                  ).toFixed(2)
                )
              )
            }
          >
            * Require to top-up{" "}
            {Math.ceil(
              accountForDecimal(
                elemental.getUserWithdrawAmountWithYield(
                  +elemental.selectedVault.vault!.amountCollected -
                    +elemental.selectedVault.vault!.amountRedeemed
                ) - elemental.selectedVaultBalance
              )
            ).toFixed(2)}
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddRewards;
