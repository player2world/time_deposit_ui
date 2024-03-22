import React, { FC } from "react";
import {
  accountForDecimal,
  handleErrors,
  handleSuccess,
} from "../../utils/function";
import Button from "../Button";
import { Transaction } from "@solana/web3.js";
import { useStoreContext } from "../../utils/useStoreContext";
import { UserInfoStruct } from "../../utils/types";

interface IProps {
  setFundTab: (value: React.SetStateAction<number>) => void;
  userInfo: UserInfoStruct;
  vaultBalance: number;
}

const UserClaim: FC<IProps> = ({ setFundTab, userInfo, vaultBalance }) => {
  const { elemental, setUserInfo, setVaultBalance, setIsLoading } =
    useStoreContext();

  const handleClaim = async () => {
    try {
      if (
        elemental &&
        elemental.selectedVault &&
        elemental.selectedVault.vault &&
        elemental.wallet
      ) {
        const ix = await elemental.userWithdrawIx(
          elemental.selectedVault.fund.vault
        );
        if (ix) {
          const tx = new Transaction().add(ix);
          try {
            const signature = await elemental.signAndSendTransaction(tx);
            handleSuccess(signature);
            setIsLoading(true);
            setFundTab(0);
            await elemental.confirmTransaction(signature);
            const ele = await elemental.refreshState();
            setUserInfo(ele.userSelectedDepositInfo!);
            setVaultBalance(ele.selectedVaultBalance);
            setIsLoading(false);
          } catch (error) {
            console.log("Error", error);
          }
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
    <div className="claim-reward">
      <div className="subTabHeader">
        <h2>Claim reward</h2>
        <button onClick={() => setFundTab(0)}>Cancel</button>
      </div>
      <div className="subTabContent">
        <div className="subTabActions">
          <h3>Claimable Amount</h3>
          {/* <input type="number" ref={claimRewardAmountRef} name="claimAmount" min={0} step={1} placeholder="Ex: 2" className="inputBox ease-in-out" /> */}
          {/* <input
                type="range"
                ref={claimRewardAmountRef}
                name="depositAmount"
                min="0"
                max="200" // Set a maximum value as per your requirement
                step="1"
                className="inputBox ease-in-out"
                onChange={(e) => setCurrentValue(Number(e.target.value))}
                // Add this if you want to track value changes
              /> */}
          {accountForDecimal(
            Number(elemental.getUserWithdrawAmountWithYield(+userInfo.amount))
          ).toFixed(2)}{" "}
          {elemental.selectedVault.fund.token}
          <Button
            disabled={
              !(
                elemental.selectedVault.vault &&
                elemental.selectedVault.vault.endDate < Date.now() &&
                +userInfo.amount > 0 &&
                !(
                  accountForDecimal(
                    Number(
                      elemental.getUserWithdrawAmountWithYield(+userInfo.amount)
                    )
                  ) > accountForDecimal(vaultBalance)
                )
              )
            }
            onClick={() => handleClaim()}
          >
            Claim
          </Button>
        </div>
        {accountForDecimal(
          Number(elemental.getUserWithdrawAmountWithYield(+userInfo.amount))
        ) > accountForDecimal(vaultBalance) && (
          <div className="subTabInfo">
            <h2>Notes</h2>
            <p>* The vault is currently not ready, check with admin</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserClaim;
