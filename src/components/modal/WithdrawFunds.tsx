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
  currentValue: number;
}

const WithdrawFunds: FC<IProps> = ({
  setFundTab,
  handleInputChange,
  currentValue,
}) => {
  const { elemental, setUserInfo, setVaultBalance, setIsLoading } =
    useStoreContext();

  const handleWithdraw = async (amount: number) => {
    console.log(
      "vault",
      +elemental.selectedVault.vault!.amountCollected,
      +elemental.selectedVault.vault!.amountWithdrawn,
      currentValue
    );
    try {
      // CHECK IF VAULT END DATE HAS PASS
      if (
        elemental &&
        elemental.selectedVault &&
        elemental.selectedVault.vault &&
        elemental.wallet
      ) {
        const ix = await elemental.authorityWithdrawIx(
          elemental.selectedVault.fund.vault,
          amount * 10 ** elemental.selectedVault.fund.decimalPlace
        );
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
        <h2>Withdraw Funds</h2>
        <button onClick={() => setFundTab(0)}>Cancel</button>
      </div>
      <div className="subTabContent">
        <div className="subTabActions">
          <h3>How much funds to withdraw</h3>
          <p>
            Available amount:{" "}
            {accountForDecimal(+elemental.selectedVaultBalance)}{" "}
            {elemental.selectedVault.fund.token}
          </p>
          <input
            type="number"
            name="withdrawAmount"
            max={
              accountForDecimal(
                +elemental.selectedVault.vault!.amountCollected
              ) -
              accountForDecimal(+elemental.selectedVault.vault!.amountWithdrawn)
            }
            className="inputBox ease-in-out"
            value={currentValue.toString()}
            onChange={(e) => handleInputChange(Number(e.target.value))}
            //prettify acting up
          />
          <Button
            onClick={() => handleWithdraw(currentValue)}
            disabled={
              currentValue === 0 ||
              !(
                elemental.selectedVault.vault &&
                accountForDecimal(
                  +elemental.selectedVault.vault.amountCollected
                ) -
                  accountForDecimal(
                    +elemental.selectedVault.vault.amountWithdrawn
                  ) >=
                  +currentValue
              )
            }
          >
            Withdraw
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
            * Funds are withdrawable anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WithdrawFunds;
