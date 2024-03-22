import React, { FC } from "react";
import { accountForDecimal, currentTimeFormat } from "../../utils/function";
import { Elemental } from "../../utils/elemental";
import Button from "../Button";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { AUTHORITY_LIST } from "../../utils/constants";
import { UserInfoStruct } from "../../utils/types";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface IProps {
  setFundTab: (value: React.SetStateAction<number>) => void;
  elemental: Elemental;
  wallet: AnchorWallet | undefined;
  userInfo: UserInfoStruct | undefined;
  isLoading: boolean;
  vaultBalance: number;
}

const Base: FC<IProps> = ({
  setFundTab,
  elemental,
  wallet,
  userInfo,
  isLoading,
  vaultBalance,
}) => {
  return (
    <div className="funds">
      <div className="fund">
        <div className="fundHeader">
          <div className="fundTitle">{elemental.selectedVault.fund.name}</div>
          <div className="fundType">
            <span
              className={`icon ${elemental.selectedVault.fund.token.toLowerCase()}`}
            >
              {elemental.selectedVault.fund.token}
            </span>
          </div>
          <div className="fundApr">
            APR: {elemental.selectedVault.fund.apr}%{" "}
            <span className="toolTip">
              (i){" "}
              <small className="toolTipInfo">
                No hidden fees, no withdrawal fees
              </small>
            </span>
          </div>
        </div>

        <div className="fundInfo">
          <p>{elemental.selectedVault.fund.description}</p>
        </div>
        <div className="fundCapacity">
          {/* <small className="toolTipInfo">Deposits progress bar</small> */}
          {
            <div className="progressBar h-11">
              <span
                className="progress h-11 whitespace-nowrap"
                style={{
                  width: `${
                    (
                      (accountForDecimal(
                        Number(
                          elemental.selectedVault.vault
                            ? elemental.selectedVault.vault.amountCollected
                            : 0
                        )
                      ) /
                        accountForDecimal(
                          Number(elemental.selectedVault.fund.capacityTotal)
                        )) *
                      100
                    ).toLocaleString("en") ?? 0
                  }%`,
                }}
              >
                {(
                  (accountForDecimal(
                    Number(
                      elemental.selectedVault.vault
                        ? elemental.selectedVault.vault.amountCollected
                        : 0
                    )
                  ) /
                    accountForDecimal(
                      Number(elemental.selectedVault.fund.capacityTotal)
                    )) *
                  100
                ).toLocaleString("en") ?? 0}
                %
              </span>
              <span className="progressCapacity">
                {accountForDecimal(
                  Number(
                    elemental.selectedVault.vault
                      ? elemental.selectedVault.vault.amountCollected
                      : 0
                  )
                ).toLocaleString() ?? 0}{" "}
                /{" "}
                {accountForDecimal(
                  Number(elemental.selectedVault.fund.capacityTotal)
                ).toLocaleString()}{" "}
                {elemental.selectedVault.fund.token}
              </span>
            </div>
          }
        </div>

        <div className="fundActions">
          {
            // publicKey.toString() ===
            // elemental.selectedVault.vault.authority.toString()
            // DOC: FOR ADMIN
            wallet &&
            elemental.selectedVault &&
            elemental.selectedVault.vault &&
            AUTHORITY_LIST.includes(wallet.publicKey.toString()) ? (
              <>
                <Button onClick={() => setFundTab(5)}>Add Reward</Button>
                {/* <Button onClick={() => setFundTab(4)}>
                          Transfer Admin
                        </Button> */}
                <Button onClick={() => setFundTab(6)}>Withdraw Fund</Button>
                <Button onClick={() => setFundTab(7)}>Close Vault</Button>
              </>
            ) : (
              // FOR EVERYONE
              <>
                {
                  // WALLET MUST BE CONNECTED
                  // elemental.allVaultInfo.length > 0 && // VAULTS FOUND
                  elemental.selectedVault && (
                    // VAULT SELECTED // USER NOT ADMIN
                    <>
                      <div className="actionCategory">
                        <Button
                          onClick={() => setFundTab(1)}
                          disabled={
                            !(
                              wallet &&
                              wallet.publicKey &&
                              elemental.selectedVault.vault &&
                              +elemental.selectedVault.vault.startDate >
                                Date.now()
                            )
                          }
                        >
                          Deposit
                        </Button>
                        <div className="actionInfo">
                          <p>
                            Deposited Amount:{" "}
                            {isLoading
                              ? // <img
                                //   src={LoadingIcon}
                                //   alt=""
                                //   height={18}
                                //   style={{ paddingTop: "2px" }}
                                // />
                                "-"
                              : Number(
                                  userInfo
                                    ? accountForDecimal(userInfo.amount)
                                    : 0
                                )}{" "}
                            {elemental.selectedVault.fund.token}
                          </p>

                          {/* <p>
                                    My Share:{" "}
                                    {Number(pools[selectedIndex].supply) !== 0
                                      ? (
                                          (Number(stakes[selectedIndex].amount) / Number(pools[selectedIndex].supply)) *
                                          100
                                        ).toLocaleString("en")
                                      : Number("0").toLocaleString("en")}
                                    %
                                  </p> */}
                        </div>
                      </div>
                      <div className="actionCategory">
                        <Button
                          // DOC: UNSTAKE NOT AVAILABLE BEFORE END DATE
                          disabled={
                            !userInfo ||
                            accountForDecimal(Number(userInfo.amount)) === 0 ||
                            (elemental.selectedVault.vault &&
                              Number(elemental.selectedVault.vault.endDate) >
                                Date.now())
                          }
                          onClick={() => setFundTab(2)}
                        >
                          Claim
                        </Button>

                        <div className="actionInfo">
                          <p>With proportional reward</p>
                          <p>
                            Claimable Amount:{" "}
                            {userInfo
                              ? accountForDecimal(
                                  Number(
                                    elemental.getUserWithdrawAmountWithYield(
                                      +userInfo.amount
                                    )
                                  )
                                ).toFixed(2)
                              : "-"}{" "}
                            {elemental.selectedVault.fund.token}
                          </p>
                          {elemental.selectedVault.vault &&
                            userInfo &&
                            +userInfo.amount > 0 &&
                            +elemental.selectedVault.vault.endDate <
                              Date.now() &&
                            accountForDecimal(
                              Number(
                                elemental.getUserWithdrawAmountWithYield(
                                  +userInfo.amount
                                )
                              )
                            ) > Math.ceil(accountForDecimal(vaultBalance)) && (
                              <p>
                                Claim is not ready at the moment, please check
                                back soon
                              </p>
                            )}
                        </div>
                      </div>
                    </>
                  )
                }
              </>
            )
          }
        </div>

        {/* WALLET CONNECTOR */}
        {/* DISPLAY DEPOSIT AND CLAIM ON WALLET CONNECT */}
        {!wallet && (
          <div className="extraInfo">
            <h3>Missing Wallet</h3>
            <WalletMultiButton style={{ background: "#333" }} />
          </div>
        )}
        {
          <>
            <div className="extraInfo">
              <h3>Extra Info</h3>
              <div className="epochInfo">
                <p>
                  <span className="icon clock" />
                  Vault start date:{" "}
                  {elemental.selectedVault.vault
                    ? currentTimeFormat(
                        new Date(+elemental.selectedVault.vault.startDate)
                      )
                    : "-"}{" "}
                  (Local Time)
                </p>
                <p>
                  <span className="icon clock" />
                  Vault end date:{" "}
                  {elemental.selectedVault.vault
                    ? currentTimeFormat(
                        new Date(+elemental.selectedVault.vault.endDate)
                      )
                    : "-"}{" "}
                  (Local Time)
                </p>
                {wallet &&
                  wallet.publicKey &&
                  AUTHORITY_LIST.includes(wallet.publicKey.toString()) && (
                    <>
                      <p>
                        <span className="icon clock" />
                        Current vault balance: {accountForDecimal(vaultBalance)}
                      </p>
                      <p>
                        <span className="icon clock" />
                        Amount to topup:{" "}
                        {accountForDecimal(
                          Number(
                            elemental.getUserWithdrawAmountWithYield(
                              +elemental.selectedVault.vault?.amountCollected
                            ) - +elemental.selectedVault.vault?.amountRedeemed
                          )
                        ).toFixed(2)}
                      </p>
                    </>
                  )}
              </div>
            </div>
          </>
        }
      </div>

      {/* LIST OF FUNDS */}
      {/* <div className="fundsList">
            {whitelistFundsData.map((fund, index) => (
              <div
                key={index}
                className={`button fundButton ${
                  elemental.selectedVault?.fund.vault === fund.vault
                    ? "selected"
                    : ""
                }`}
                onClick={() => {
                  if (
                    elemental.allVaultInfo.length > 0 &&
                    elemental.selectedVault &&
                    elemental.selectedVault.vault
                  ) {
                    elemental.selectedVault = elemental.allVaultInfo.find(
                      (vault) => {
                        return vault.fund.vault === fund.vault;
                      }
                    );
                  }
                }}
              >
                <span className={`fundIcon ${fund.name.toLowerCase()}`}></span>
                <span className="fundName">{fund.name}</span>
              </div>
            ))}
          </div> */}
    </div>
  );
};

export default Base;
