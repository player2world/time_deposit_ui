import { useState, useRef, useEffect } from "react";
import { useWallet, useAnchorWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PublicKey, Transaction } from "@solana/web3.js";
import Button from "./Button";
import {
  accountForDecimal,
  currentTimeFormat,
  handleErrors,
  handleSuccess,
} from "../utils/function";
import { useStoreContext } from "../utils/useStoreContext";
import { AUTHORITY_LIST } from "../utils/constants";
import { UserInfoStruct } from "../utils/types";

export const Elemental = () => {
  const wallet = useAnchorWallet();
  const { publicKey } = useWallet();
  // Use the context"
  //   const { elementalContext, pools, stakes } = useSDKInit();
  const { elemental } = useStoreContext();

  // Generic modal stuff
  // State to track the current multiple value
  const [userInfo, setUserInfo] = useState<UserInfoStruct | undefined>(
    elemental.userSelectedDepositInfo
  );
  const [vaultBalance, setVaultBalance] = useState<number>(
    +elemental.selectedVaultBalance
  );
  const [minAmount, setMinAmount] = useState(0);
  const [vaultCapacity, setVaultCapacity] = useState(0);
  const [amountCollected, setAmountCollected] = useState(0);
  const [multiple, setMultiple] = useState(1);
  const toAddressRef = useRef<HTMLInputElement>(null);
  // Refs for both inputs
  const numberDepositRef = useRef(null);

  // const [solUsdcPrice, setSolUsdcPrice] = useState<number | null>(null);
  // const RAYDIUM_AMM_ID_SOL_USDC =
  //   "58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2";
  // GET LATEST SOL PRICE, FETCH ONCE ON LOAD
  // useEffect(() => {
  //   async function fetchSolPrice() {
  //     try {
  //       const response = await fetch("https://api.raydium.io/v2/main/pairs");
  //       const jsonData = await response.json();
  //       const solUsdcPair = jsonData.find(
  //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //         (pair: any) => pair.ammId === RAYDIUM_AMM_ID_SOL_USDC
  //       );
  //       console.log("SOL-USDC pair", solUsdcPair);
  //       if (solUsdcPair) {
  //         const solPriceInUSDC = solUsdcPair.price;
  //         setSolUsdcPrice(solPriceInUSDC);
  //         //alert(solPriceInUSDC);
  //         console.log("SOL-USDC price", solPriceInUSDC);
  //       } else {
  //         console.log("SOL-USDC pair not found in Raydium data");
  //       }
  //     } catch (error) {
  //       console.log("Error fetching SOL price:", error);
  //     }
  //   }
  //   fetchSolPrice();
  // }, []);
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
          setFundTab(0);
          await elemental.confirmTransaction(signature);
          const ele = await elemental.refreshState();
          console.log("TEST 1");
          setUserInfo(ele.userSelectedDepositInfo);
          setVaultBalance(ele.selectedVaultBalance);
          console.log("TEST 2");
        } else {
          throw Error("Error with constructing of init or deposit IX");
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      handleErrors(err);
    }
  };
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
          setFundTab(0);
          await elemental.confirmTransaction(signature);
          const ele = await elemental.refreshState();
          console.log("TEST 1");
          setUserInfo(ele.userSelectedDepositInfo);
          setVaultBalance(ele.selectedVaultBalance);
          console.log("TEST 2");
        } else {
          throw Error("Error with constructing of init or deposit IX");
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      handleErrors(err);
    }
  };

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
            setFundTab(0);
            await elemental.confirmTransaction(signature);
            const ele = await elemental.refreshState();
            console.log("TEST 1");
            setUserInfo(ele.userSelectedDepositInfo);
            setVaultBalance(ele.selectedVaultBalance);
            console.log("TEST 2");
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
  const handleWithdraw = async (amount: number) => {
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
          setFundTab(0);
          await elemental.confirmTransaction(signature);
          const ele = await elemental.refreshState();
          console.log("TEST 1");
          setUserInfo(ele.userSelectedDepositInfo);
          setVaultBalance(ele.selectedVaultBalance);
          console.log("TEST 2");
        } else {
          throw Error("Error with constructing of user withdraw ix");
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      handleErrors(err);
    }
  };
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

  const handleTransferAdmin = async () => {
    try {
      if (
        elemental &&
        elemental.selectedVault &&
        elemental.selectedVault.vault &&
        elemental.wallet &&
        toAddressRef.current
      ) {
        // CHECK ADMIN WHITELIST
        const ix = await elemental.updateVaultAuthorityIx(
          elemental.selectedVault.fund.vault,
          new PublicKey(toAddressRef.current.value)
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
    const newValue = inputValue;

    // Check if the input is not a number or is empty (to allow clearing the input)
    if (isNaN(newValue) || inputValue === 0) {
      setCurrentValue(NaN); // Allow the input to be cleared
      setIsValidMultiple(false); // Update validity as needed
    } else {
      // For valid numbers, proceed with your logic
      setCurrentValue(newValue); // You might need to adjust this for your use case

      // Validate whether the newValue is a multiple of the current multiple value
      const isValid = newValue % minAmount === 0;
      if (isValid) {
        setMultiple(
          newValue / accountForDecimal(elemental.selectedVault.vault?.minAmount)
        );
      }
      setIsValidMultiple(isValid);
    }
  };

  // TAB CONTENT
  // 0 = BASE
  // 1 = DEPOSIT
  // 2 = UNSTAKE
  // 3 = SETTLE
  // 4 = TRANSFER ADMIN
  // 5 = ADD REWARDS
  // 6 = WITHDRAW FUNDS
  // 7 = CLOSE VAULT
  const tabContents = [
    //write contents
    <div key="2" className="general">
      {/* // CONNECT WALLET => SELECT DEPOSIT MODAL */}
      {fundTab === 1 && (
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
                {elemental.selectedVaultUserBaseBalance /
                  10 ** elemental.selectedVault.fund.decimalPlace}{" "}
                {elemental.selectedVault.fund.token}
              </p>

              <input
                type="number"
                ref={numberDepositRef}
                name="depositAmount"
                min={minAmount}
                max={
                  accountForDecimal(vaultCapacity) -
                  accountForDecimal(amountCollected)
                }
                step={multiple}
                placeholder={`Multiples of ${minAmount}`}
                className="inputBox ease-in-out"
                value={currentValue}
                onChange={(e) => handleInputChange(Number(e.target.value))}
              />
              {/* <input
                      type="range"
                      ref={depositAmountRef}
                      name="depositAmount"
                      min={multiple}
                      max={maxStakeAmount}
                      step={multiple}
                      value={currentValue}
                      className="inputBox ease-in-out appearance-none"
                      onChange={(e) => handleInputChange(Number(e.target.value))}
                      // Add this if you want to track value changes
                    /> */}

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
                * The deposited amount will only start accruing interest on
                vault activation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* // CONNECT WALLET => SELECT UNSTAKE MODAL */}

      {fundTab === 2 && userInfo && (
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
                Number(
                  elemental.getUserWithdrawAmountWithYield(+userInfo.amount)
                )
              ).toFixed(elemental.selectedVault.fund.decimalPlace)}{" "}
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
                          elemental.getUserWithdrawAmountWithYield(
                            +userInfo.amount
                          )
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
      )}
      {/* // CONNECT WALLET => TRANSFER ADMIN MODAL, REQUIRE WHITELIST ADMIN */}
      {fundTab === 4 && (
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
                ref={toAddressRef}
                name="toAddress"
                min={0}
                step={1}
                placeholder="New admin address"
                className="inputBox ease-in-out"
              />
              <Button onClick={() => handleTransferAdmin()}>
                Transfer Admin
              </Button>
            </div>
            <div className="subTabInfo">
              <h2>Hello there</h2>
              <p>Here is where we add all the additional info desired</p>
              <p>Be careful, the boogeyman is coming!</p>
            </div>
          </div>
        </div>
      )}

      {fundTab === 5 && (
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
                ref={numberDepositRef}
                name="depositAmount"
                className="inputBox ease-in-out"
                value={currentValue}
                onChange={(e) => handleInputChange(Number(e.target.value))}
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
              <p
                onClick={() =>
                  handleInputChange(
                    Number(
                      accountForDecimal(
                        elemental.getUserWithdrawAmountWithYield(
                          +elemental.selectedVault.vault!.amountCollected -
                            +elemental.selectedVault.vault!.amountRedeemed
                        )
                      ).toFixed(elemental.selectedVault.fund.decimalPlace)
                    )
                  )
                }
              >
                * Expected deposit amount with yield{" "}
                {accountForDecimal(
                  elemental.getUserWithdrawAmountWithYield(
                    +elemental.selectedVault.vault!.amountCollected -
                      +elemental.selectedVault.vault!.amountRedeemed
                  )
                ).toFixed(elemental.selectedVault.fund.decimalPlace)}
                .
              </p>
            </div>
          </div>
        </div>
      )}

      {fundTab === 6 && (
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
                {accountForDecimal(
                  +elemental.selectedVault.vault!.amountCollected -
                    +elemental.selectedVault.vault!.amountRedeemed
                )}{" "}
                {elemental.selectedVault.fund.token}
              </p>
              <input
                type="number"
                ref={numberDepositRef}
                name="depositAmount"
                max={
                  +elemental.selectedVault.vault!.amountCollected -
                  +elemental.selectedVault.vault!.amountRedeemed
                }
                className="inputBox ease-in-out"
                value={currentValue}
                onChange={(e) => handleInputChange(Number(e.target.value))}
              />
              <Button
                onClick={() => handleWithdraw(currentValue)}
                disabled={
                  !(
                    elemental.selectedVault.vault &&
                    (currentValue !== 0 ||
                      +elemental.selectedVault.vault.amountCollected -
                        +elemental.selectedVault.vault.amountRedeemed >
                        currentValue ||
                      elemental.selectedVault.vault.endDate > Date.now())
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
      )}
      {fundTab === 7 && (
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
                disabled={
                  +elemental.selectedVault.vault!.endDate +
                    +elemental.selectedVault.vault!.withdrawTimeframe >
                  Date.now()
                }
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
      )}

      {fundTab === 0 && elemental && elemental.selectedVault && (
        <div className="funds">
          <div className="fund">
            <div className="fundHeader">
              <div className="fundTitle">
                {elemental.selectedVault.fund.name}
              </div>
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
                                  Number(
                                    elemental.selectedVault.vault.startDate
                                  ) > Date.now()
                                )
                              }
                            >
                              Deposit
                            </Button>
                            <div className="actionInfo">
                              <p>
                                Deposited Amount:{" "}
                                {Number(
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
                                accountForDecimal(Number(userInfo.amount)) ===
                                  0 ||
                                (elemental.selectedVault.vault &&
                                  Number(
                                    elemental.selectedVault.vault.endDate
                                  ) > Date.now())
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
                                    ).toFixed(
                                      elemental.selectedVault.fund.decimalPlace
                                    )
                                  : "-"}{" "}
                                {elemental.selectedVault.fund.token}
                              </p>
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
                        ? new Date(
                            Number(elemental.selectedVault.vault.endDate)
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
                            .replace("pm", "PM")
                        : "-"}{" "}
                      (Local Time)
                    </p>
                    {wallet &&
                      wallet.publicKey &&
                      AUTHORITY_LIST.includes(wallet.publicKey.toString()) && (
                        <>
                          <p>
                            <span className="icon clock" />
                            Current vault balance:{" "}
                            {accountForDecimal(vaultBalance)}
                          </p>
                          <p>
                            <span className="icon clock" />
                            Amount to topup:{" "}
                            {accountForDecimal(
                              Number(
                                elemental.getUserWithdrawAmountWithYield(
                                  +elemental.selectedVault.vault
                                    ?.amountCollected
                                ) -
                                  +elemental.selectedVault.vault?.amountRedeemed
                              )
                            ).toFixed(
                              elemental.selectedVault.fund.decimalPlace
                            )}
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
          <div className="extraInfo">
            <WalletMultiButton style={{ background: "#333" }} />
          </div>
        )}
      </div>

      <div className="modalBody">
        {/* <div className="modalContent">{tabContents[0]}</div> */}
        <div className="modalContent">
          {!elemental.selectedVault.vault ? (
            // VAULT NOT FOUND
            <div>Loading vault...</div>
          ) : publicKey && AUTHORITY_LIST.includes(publicKey.toString()) ? (
            // VAULT FOUND, IS ADMIN
            <div className="modalContent">{tabContents[0]}</div>
          ) : +elemental.selectedVault.vault.endDate +
              +elemental.selectedVault.vault.withdrawTimeframe <
            Date.now() ? (
            // VAULT FOUND BUT INACTIVE
            <div>Not active vault at the moment</div>
          ) : (
            // VAULT FOUND, IS VALID, IS USER
            <div className="modalContent">{tabContents[0]}</div>
          )}
        </div>
      </div>
    </>
  );
};
