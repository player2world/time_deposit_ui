import React, { FC, useEffect, useState } from "react";
import Button from "../Button";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { PublicKey, Transaction } from "@solana/web3.js";
import { useStoreContext } from "../../utils/useStoreContext";
import { useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import {
  crossReferenceString,
  currentTimeFormat,
  handleErrors,
  handleSuccess,
} from "../../utils/function";
import { AllVaultStruct } from "../../utils/types";

interface IProps {
  setFundTab: (value: React.SetStateAction<number>) => void;
}

const CreateVault: FC<IProps> = ({ setFundTab }) => {
  const [numActiveVaults, setNumActiveVaults] = useState(0);
  const [allVaultData, setAllVaultData] = useState<AllVaultStruct | null>(null);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 1000 * 60 * 60 * 1)
  ); // 1 hour from now
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
  ); // 3 days from now
  const [minAmount, setMinAmount] = useState(0);
  const [newVaultMint, setNewVaultMint] = useState<PublicKey | string>("");
  const [newVault, setNewVault] = useState<PublicKey | string>("");
  const [validMint, setValidMint] = useState(false);
  const [vaultCapacity, setVaultCapacity] = useState(0);
  const [withdrawTimeframeDays, setWithdrawTimeframeDays] = useState(0);
  const [yieldBps, setYieldBps] = useState(0);

  const wallet = useAnchorWallet();
  const { publicKey } = useWallet();

  const { elemental, setVaultBalance, setIsLoading } = useStoreContext();

  useEffect(() => {
    (async () => {
      const allVault = await elemental.getAllVaultData();
      console.log("allVault", allVault[0].publicKey.toString());
      setNumActiveVaults(allVault.length);
      setAllVaultData(allVault);
    })();
  }, []);

  const handleCreateVault = async () => {
    try {
      // CHECK IF ALL REQUIRED STATES ARE IN PLACE
      if (elemental && publicKey) {
        // GET CREATE IX
        const { ix, vault } = await elemental.initVaultIx(
          new PublicKey(newVaultMint),
          Math.floor(startDate.getTime()),
          Math.floor(endDate.getTime()),
          minAmount,
          vaultCapacity,
          withdrawTimeframeDays,
          yieldBps,
          publicKey
        );
        // CREATE CREATE TX
        if (ix && wallet) {
          const tx = new Transaction().add(ix);
          const signature = await elemental.signAndSendTransaction(tx);
          handleSuccess(signature);
          setIsLoading(true);
          setFundTab(0);
          await elemental.confirmTransaction(signature);
          const ele = await elemental.refreshNewVault(vault);
          console.log("vault", vault.toString());
          setNewVault(vault);
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

  const handleCloseAll = async () => {
    try {
      // CHECK IF ALL REQUIRED STATES ARE IN PLACE
      if (allVaultData && allVaultData.length > 0) {
        // GET CREATE IX
        const tx = new Transaction();
        for (const vaultData of allVaultData) {
          const ix = await elemental.closeVaultIx(vaultData.publicKey);
          if (ix) tx.add(ix);
        }
        // CREATE CREATE TX
        if (tx && wallet) {
          const signature = await elemental.signAndSendTransaction(tx);
          handleSuccess(signature);

          await elemental.confirmTransaction(signature);

          const allVault = await elemental.getAllVaultData();
          setNumActiveVaults(allVault.length);

          setIsLoading(false);
        } else {
          throw Error("Error with constructing close IXs");
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <h2>Create Vault</h2>
          <p>Number of vault: {numActiveVaults}</p>
          <button onClick={handleCloseAll}>Close All</button>
          {newVault && <p>New Vault: {newVault.toString()}</p>}
        </div>
      </div>
      <div className="subTabContent">
        <div className="subTabActions">
          <h3>Setup a new vault</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div>
              <p>Start Date:</p>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date!)}
                showTimeSelect
                dateFormat="Pp"
                required
              />
            </div>
            <div>
              <p>End Date:</p>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date!)}
                showTimeSelect
                dateFormat="Pp"
                required
              />
            </div>
            <div>
              <p>Mint:</p>
              <input
                type="text"
                name="newVaultMint"
                placeholder={`Deposit Mint`}
                className="inputBox ease-in-out"
                value={newVaultMint.toString()}
                onChange={(e) => {
                  try {
                    setNewVaultMint(new PublicKey(e.target.value));
                    setValidMint(true);
                  } catch (error) {
                    setNewVaultMint(e.target.value);
                    setValidMint(false);
                  }
                }}
              />
            </div>
            <div>
              <p>Minimum Deposit Amount:</p>
              <input
                type="number"
                name="minAmount"
                placeholder={`Min amount`}
                className="inputBox ease-in-out"
                value={minAmount.toString()}
                onChange={(e) => setMinAmount(+e.target.value)}
              />
            </div>
            <div>
              <p>Vault Capacity:</p>
              <input
                type="number"
                name="vaultCapacity"
                placeholder={`Vault Capacity`}
                className="inputBox ease-in-out"
                value={vaultCapacity.toString()}
                onChange={(e) => setVaultCapacity(+e.target.value)}
              />
            </div>
            <div>
              <p>Admin Withdraw Timeframe (Days):</p>
              <input
                type="number"
                name="withdrawTimeframeDays"
                placeholder={`Days to withdraw for Admin`}
                className="inputBox ease-in-out"
                value={withdrawTimeframeDays.toString()}
                onChange={(e) => setWithdrawTimeframeDays(+e.target.value)}
              />
            </div>
            <div>
              <p>Percentage Yield:</p>
              <input
                type="number"
                name="yieldBps"
                placeholder={`10 for 10%`}
                className="inputBox ease-in-out"
                value={yieldBps.toString()}
                onChange={(e) => setYieldBps(+e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleCreateVault}
            disabled={
              !startDate ||
              !endDate ||
              !minAmount ||
              !newVaultMint ||
              !vaultCapacity ||
              !withdrawTimeframeDays ||
              !yieldBps ||
              !validMint
            }
          >
            Create
          </Button>
        </div>
        <div className="subTabInfo">
          <h2>Notes</h2>
          <p>
            Start date:
            <br /> {currentTimeFormat(startDate)} (Local Time)
          </p>
          <p>
            End date:
            <br /> {currentTimeFormat(endDate)} (Local Time)
          </p>
          <p>
            Selected Mint:
            <br />{" "}
            {newVaultMint && crossReferenceString(newVaultMint.toString())
              ? crossReferenceString(newVaultMint.toString())
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateVault;
