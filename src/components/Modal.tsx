import { useState, useEffect } from "react";

import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import { accountForDecimal, handleErrors } from "../utils/function";
import { useStoreContext } from "../utils/useStoreContext";
import UserDeposit from "./modal/UserDeposit";
import UserClaim from "./modal/UserClaim";
import TransferAdmin from "./modal/TransferAdmin";
import AddRewards from "./modal/AddRewards";
import WithdrawFunds from "./modal/WithdrawFunds";
import Close from "./modal/Close";
import Base from "./modal/Base";
import CreateVault from "./modal/CreateVault";
import { AUTHORITY_LIST } from "../utils/constants";

const Elemental = () => {
  const wallet = useAnchorWallet();
  const { publicKey } = useWallet();
  const { elemental, userInfo, vaultBalance, isLoading } = useStoreContext();

  // Generic modal stuff
  const [minAmount, setMinAmount] = useState(0);
  const [vaultCapacity, setVaultCapacity] = useState(0);
  const [amountCollected, setAmountCollected] = useState(0);
  const [multiple, setMultiple] = useState(1);
  const [toAddress, setToAddress] = useState("");

  const [fundTab, setFundTab] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [isValidMultiple, setIsValidMultiple] = useState(false);

  // TRIGGER WHEN DIFFERENT VAULT SELECTED
  useEffect(() => {
    console.log("elemental.selectedVault", elemental.selectedVault);
    // Update the multiple state whenever selectedIndex changes
    try {
      if (elemental.selectedVault && elemental.selectedVault.vault) {
        const minAmount = accountForDecimal(
          +elemental.selectedVault.vault.minAmount
        );
        const vaultCapacity = accountForDecimal(
          +elemental.selectedVault.vault.vaultCapacity
        );
        const amountCollected = accountForDecimal(
          +elemental.selectedVault.vault.amountCollected
        );
        setMinAmount(minAmount);
        setVaultCapacity(vaultCapacity);
        setAmountCollected(amountCollected);
      }
    } catch (err) {
      handleErrors(err);
    }
  }, [elemental.selectedVault]);

  // INPUT OF VAULT DEPOSIT
  const handleInputChange = (inputValue: number) => {
    // Check if the input is not a number or is empty (to allow clearing the input)
    if (isNaN(inputValue) || inputValue === 0) {
      setCurrentValue(NaN); // Allow the input to be cleared
      setIsValidMultiple(false); // Update validity as needed
    } else {
      // For valid numbers, proceed with your logic
      setCurrentValue(inputValue); // You might need to adjust this for your use case

      // Validate whether the newValue is a multiple of the current multiple value
      const isValid = inputValue % minAmount === 0;
      if (isValid) {
        setMultiple(
          inputValue /
            accountForDecimal(elemental.selectedVault.vault?.minAmount)
        );
      }
      setIsValidMultiple(isValid);
    }
  };

  // TAB CONTENT
  // 0 = BASE
  // 1 = DEPOSIT
  // 2 = UNSTAKE
  // 3 = CREATE VAULT
  // 4 = TRANSFER ADMIN
  // 5 = ADD REWARDS
  // 6 = WITHDRAW FUNDS
  // 7 = CLOSE VAULT

  const tabContents = [
    //write contents

    <div key="2" className="general">
      {/* // CONNECT WALLET => SELECT DEPOSIT MODAL */}
      {fundTab === 1 && (
        <UserDeposit
          setFundTab={setFundTab}
          handleInputChange={handleInputChange}
          minAmount={minAmount}
          vaultCapacity={vaultCapacity}
          amountCollected={amountCollected}
          isValidMultiple={isValidMultiple}
          multiple={multiple}
          currentValue={currentValue}
        />
      )}

      {/* // CONNECT WALLET => SELECT UNSTAKE MODAL */}
      {fundTab === 2 && userInfo && (
        <UserClaim
          setFundTab={setFundTab}
          userInfo={userInfo}
          vaultBalance={vaultBalance}
        />
      )}

      {fundTab === 3 && <CreateVault setFundTab={setFundTab} />}
      {/* // CONNECT WALLET => TRANSFER ADMIN MODAL, REQUIRE WHITELIST ADMIN */}
      {fundTab === 4 && (
        <TransferAdmin
          setFundTab={setFundTab}
          setToAddress={setToAddress}
          toAddress={toAddress}
        />
      )}

      {fundTab === 5 && (
        <AddRewards
          setFundTab={setFundTab}
          vaultBalance={vaultBalance}
          currentValue={currentValue}
          handleInputChange={handleInputChange}
        />
      )}

      {fundTab === 6 && (
        <WithdrawFunds
          setFundTab={setFundTab}
          handleInputChange={handleInputChange}
          currentValue={currentValue}
        />
      )}
      {fundTab === 7 && (
        <Close
          setFundTab={setFundTab}
          handleInputChange={handleInputChange}
          vaultBalance={vaultBalance}
        />
      )}

      {fundTab === 0 && elemental && elemental.selectedVault && (
        <Base
          setFundTab={setFundTab}
          elemental={elemental}
          wallet={wallet}
          userInfo={userInfo}
          isLoading={isLoading}
          vaultBalance={vaultBalance}
        />
      )}
    </div>,
  ];

  return (
    <>
      <div className="modalHeader">
        <h1>Elemental DeFi</h1>
        {publicKey ? (
          <div onClick={() => setFundTab(0)}>
            <WalletDisconnectButton
              style={{
                background: "#333",
                fontWeight: "bold",
                border: "none",
                fontFamily: "Pixolletta8px !important",
              }}
            />
          </div>
        ) : (
          elemental.activeVault === 0 && (
            <div onClick={() => setFundTab(0)}>
              <WalletMultiButton
                style={{
                  background: "#333",
                  fontWeight: "bold",
                  border: "none",
                  fontFamily: "Pixolletta8px !important",
                }}
              />
            </div>
          )
        )}
      </div>

      <div className="modalBody">
        {/* <div className="modalContent">{tabContents[0]}</div> */}
        <div className="modalContent">
          {wallet &&
          AUTHORITY_LIST.includes(wallet.publicKey.toString()) &&
          elemental.activeVault === 0 ? (
            <div className="modalContent">
              <CreateVault setFundTab={setFundTab} />
            </div>
          ) : elemental.activeVault === -1 ? (
            // VAULT NOT FOUND
            <div>Loading vault...</div>
          ) : elemental.activeVault === 1 ? (
            // VAULT FOUND
            <div className="modalContent">{tabContents[0]}</div>
          ) : (
            // NO VAULT FOUND
            <div>No active vault at the moment</div>
          )}
        </div>
      </div>
    </>
  );
};
export default Elemental;
