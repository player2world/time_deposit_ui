import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { ElementalVault } from "./idl/elemental_vault";

export interface Fund {
  vault: PublicKey;
  name: string;
  token: string;
  decimalPlace: number;
  icon: string;
  apr: number;
  description: string;
  capacityPercentage: number;
  capacityTotal: number;
  capacityCurrent: number;
  deposit: boolean;
  withdraw: boolean;
}

export interface Vault {
  vaultCount: anchor.BN;
  authority: PublicKey;
  baseMint: PublicKey;
  yieldBps: number;
  vaultCapacity: anchor.BN;
  minAmount: anchor.BN;
  startDate: anchor.BN;
  endDate: anchor.BN;
  withdrawTimeframe: anchor.BN;
  amountCollected: anchor.BN;
  //   amountWithdrawn: anchor.BN;
  //   amountRedeemed: anchor.BN;
}

export interface VaultData {
  fund: Fund;
  vault?: VaultStruct;
}

export interface User {
  vault_count: anchor.BN;
  owner: PublicKey;
  amount: anchor.BN;
  baseMintInfo: BaseMintOption;
}

enum BaseMintOption {
  USDC = 6,
  SOL = 9,
}

export type UserInfoStruct = anchor.IdlAccounts<ElementalVault>["user"];
export type GlobalStruct = anchor.ProgramAccount<
  anchor.IdlAccounts<ElementalVault>["global"]
>;
export type VaultStruct = anchor.IdlAccounts<ElementalVault>["vault"];
