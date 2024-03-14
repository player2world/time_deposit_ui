import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { ElementalVault } from "./idl/elemental_vault";
import { VaultData, UserInfoStruct } from "./types";
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { whitelistFundsData } from "./constants";
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

export class Elemental {
  selectedVault: VaultData;
  selectedVaultBalance: number;
  selectedVaultUserBaseBalance: number;
  userSelectedDepositInfo: UserInfoStruct | undefined;
  wallet: AnchorWallet | undefined;
  connection: Connection;
  program: Program<ElementalVault>;
  allVaultInfo: VaultData[];
  globalPda: PublicKey;

  constructor(program: Program<ElementalVault>, wallet?: AnchorWallet) {
    this.selectedVault = { fund: whitelistFundsData[0], vault: undefined };
    this.selectedVaultBalance = 0;
    this.selectedVaultUserBaseBalance = 0;
    this.userSelectedDepositInfo = undefined;
    this.wallet = wallet;
    this.connection = program.provider.connection;
    this.program = program;
    this.allVaultInfo = [];

    const [globalPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("global")],
      program.programId
    );
    this.globalPda = globalPda;
  }

  //   INITIALIZE
  //   =================================== INITIALIZE
  init = async (wallet = this.wallet) => {
    const vault = await this.getVaultData(whitelistFundsData[0].vault);
    if (wallet) {
      const userPda = this.getUserPda(vault.vaultCount, wallet.publicKey);
      try {
        this.userSelectedDepositInfo = await this.getUserData(userPda);
      } catch (error) {
        console.log("User account not found");
      }
      console.log("(!!wallet && !!wallet.publicKey)", wallet, wallet.publicKey);

      const userAta = getAssociatedTokenAddressSync(
        vault.baseMint,
        wallet.publicKey
      );
      const userBalance = await this.connection.getTokenAccountBalance(userAta);
      console.log("+userBalance.value.amount");
      console.log(+userBalance.value.amount);
      this.selectedVaultUserBaseBalance = +userBalance.value.amount;
    }

    // LOAD ALL WHITELIST VAULT
    // const allVaultData = await this.getAllVaultData();
    // this.allVaultInfo = allVaultData.flatMap((vault) => {
    //   const fund: Fund | undefined = whitelistFundsData.find(
    //     (fund) => fund.vault.toString() === vault.publicKey.toString()
    //   );
    //   if (fund) {
    //     return [{ fund, vault }];
    //   } else {
    //     return [];
    //   }
    // });

    // this.selectedVault = this.allVaultInfo[0];
    this.selectedVault = {
      fund: whitelistFundsData[0],
      vault: vault,
    };
    const vaultAta = getAssociatedTokenAddressSync(
      vault.baseMint,
      this.selectedVault.fund.vault,
      true
    );
    const vaultBalance = await this.connection.getTokenAccountBalance(vaultAta);
    this.selectedVaultBalance = +vaultBalance.value.amount;
  };
  //   =================================== FETCH PDA
  getGlobalData = async () => {
    return await this.program.account.global.fetch(this.globalPda);
  };
  getVaultPda = (vaultCount: anchor.BN) => {
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), vaultCount.toArrayLike(Buffer, "le", 8)],
      this.program.programId
    );
    return vaultPda;
  };
  getVaultData = async (vault: PublicKey) => {
    const data = await this.program.account.vault.fetch(vault);
    return data;
  };
  getAllVaultData = async () => {
    const allVault = await this.program.account.vault.all();
    return allVault;
  };
  getUserPda = (vaultCount: anchor.BN, owner: PublicKey) => {
    const [userPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("user"),
        vaultCount.toArrayLike(Buffer, "le", 8),
        owner.toBuffer(),
      ],
      this.program.programId
    );
    return userPda;
  };
  getUserData = async (user: PublicKey) => {
    const data = await this.program.account.user.fetch(user);
    return data;
  };
  getAllUserDataByOwner = (owner: PublicKey) => {
    const filter = [
      {
        memcmp: {
          offset: 8 + 8,
          bytes: owner.toBase58(),
        },
      },
    ];
    return this.program.account.user.all(filter);
  };

  //   =================================== VAULT INSTRUCTION
  initVaultIx = async (
    mint: PublicKey,
    startDate: number,
    endDate: number,
    minAmount: number,
    vaultCapacity: number,
    withdrawTimeframe: number,
    yieldBps: number
  ) => {
    if (this.wallet) {
      const globalData = await this.getGlobalData();
      const vault = this.getVaultPda(globalData.vaultCounter);
      const vaultAta = getAssociatedTokenAddressSync(mint, vault, true);

      return await this.program.methods
        .initOrUpdateVault(globalData.vaultCounter, {
          startDate: new anchor.BN(startDate),
          endDate: new anchor.BN(endDate),
          minAmount: new anchor.BN(minAmount),
          vaultCapacity: new anchor.BN(vaultCapacity),
          withdrawTimeframe: new anchor.BN(withdrawTimeframe),
          yieldBps: yieldBps,
        })
        .accounts({
          initializer: this.wallet?.publicKey,
          global: this.globalPda,
          baseMint: mint,
          vault,
          vaultAta,
        })
        .instruction();
    } else {
      throw Error("Wallet not connected");
    }
  };
  updateVaultIx = async (
    vault: PublicKey,
    startDate: number,
    endDate: number,
    minAmount: number,
    vaultCapacity: number,
    withdrawTimeframe: number,
    yieldBps: number
  ) => {
    if (this.wallet) {
      const vaultData = await this.getVaultData(vault);
      const vaultAta = getAssociatedTokenAddressSync(
        vaultData.baseMint,
        vault,
        true
      );

      if (vaultData.amountCollected > 0 || Date.now() > vaultData.startDate) {
        throw Error("Vault is active OR deposit found");
      }

      return await this.program.methods
        .initOrUpdateVault(vaultData.vaultCount, {
          startDate: new anchor.BN(startDate),
          endDate: new anchor.BN(endDate),
          minAmount: new anchor.BN(minAmount),
          vaultCapacity: new anchor.BN(vaultCapacity),
          withdrawTimeframe: new anchor.BN(withdrawTimeframe),
          yieldBps: yieldBps,
        })
        .accounts({
          initializer: this.wallet?.publicKey,
          global: this.globalPda,
          baseMint: vaultData.baseMint,
          vault,
          vaultAta,
        })
        .instruction();
    } else {
      throw Error("Wallet not connected");
    }
  };
  updateVaultAuthorityIx = async (
    vault: PublicKey,
    newAuthority: PublicKey
  ) => {
    if (this.wallet) {
      const vaultData = await this.getVaultData(vault);

      if (vaultData.authority.toString() !== this.wallet.publicKey.toString()) {
        throw Error("Unauthorize");
      }
      return await this.program.methods
        .updateAuthority(vaultData.vaultCount, newAuthority)
        .accounts({
          currentAuthority: this.wallet.publicKey,
          vault,
        })
        .instruction();
    } else {
      throw Error("Wallet not connected");
    }
  };
  //   =================================== USER INSTRUCTION
  initOrDepositUserIx = async (vault: PublicKey, baseAmount: number) => {
    if (this.wallet) {
      const vaultData = await this.getVaultData(vault);
      const userPda = this.getUserPda(
        vaultData.vaultCount,
        this.wallet.publicKey
      );

      const userAta = getAssociatedTokenAddressSync(
        vaultData.baseMint,
        this.wallet.publicKey
      );
      const vaultAta = getAssociatedTokenAddressSync(
        vaultData.baseMint,
        vault,
        true
      );

      return await this.program.methods
        .initOrDepositUser(vaultData.vaultCount, new anchor.BN(baseAmount))
        .accounts({
          owner: this.wallet.publicKey,
          sourceAta: userAta,
          destinationAta: vaultAta,
          vault,
          user: userPda,
          baseMint: vaultData.baseMint,
        })
        .instruction();
    }
  };
  userWithdrawIx = async (vault: PublicKey) => {
    if (this.wallet) {
      const vaultData = await this.getVaultData(vault);
      const userPda = this.getUserPda(
        vaultData.vaultCount,
        this.wallet.publicKey
      );
      const userAta = getAssociatedTokenAddressSync(
        vaultData.baseMint,
        this.wallet.publicKey
      );
      const vaultAta = getAssociatedTokenAddressSync(
        vaultData.baseMint,
        vault,
        true
      );

      return await this.program.methods
        .userWithdraw(vaultData.vaultCount)
        .accounts({
          owner: this.wallet.publicKey,
          sourceAta: vaultAta,
          destinationAta: userAta,
          vault: vault,
          user: userPda,
          baseMint: vaultData.baseMint,
        })
        .instruction();
    }
  };
  //   =================================== AUTHORITY INSTRUCTION
  authorityWithdrawIx = async (vault: PublicKey, baseAmount: number) => {
    if (this.wallet) {
      const vaultData = await this.getVaultData(vault);

      const authorityAta = getAssociatedTokenAddressSync(
        vaultData.baseMint,
        this.wallet.publicKey
      );
      const vaultAta = getAssociatedTokenAddressSync(
        vaultData.baseMint,
        vault,
        true
      );

      return await this.program.methods
        .authorityWithdraw(vaultData.vaultCount, new anchor.BN(baseAmount))
        .accounts({
          authority: this.wallet.publicKey,
          destinationAta: authorityAta,
          vaultAta,
          vault,
          baseMint: vaultData.baseMint,
        })
        .instruction();
    }
  };
  closeVaultIx = async (vault: PublicKey) => {
    if (this.wallet) {
      const vaultData = await this.getVaultData(vault);

      const authorityAta = getAssociatedTokenAddressSync(
        vaultData.baseMint,
        this.wallet.publicKey
      );
      const vaultAta = getAssociatedTokenAddressSync(
        vaultData.baseMint,
        vault,
        true
      );

      return await this.program.methods
        .closeVault(vaultData.vaultCount)
        .accounts({
          authority: this.wallet.publicKey,
          sourceAta: vaultAta,
          destinationAta: authorityAta,
          vault,
          baseMint: vaultData.baseMint,
        })
        .instruction();
    }
  };
  transferToVaultIx = async (vault: PublicKey, amount: number) => {
    if (this.wallet) {
      const vaultData = await this.getVaultData(vault);

      const authorityAta = getAssociatedTokenAddressSync(
        vaultData.baseMint,
        this.wallet.publicKey
      );
      const vaultAta = getAssociatedTokenAddressSync(
        vaultData.baseMint,
        vault,
        true
      );

      return createTransferCheckedInstruction(
        authorityAta,
        vaultData.baseMint,
        vaultAta,
        this.wallet.publicKey,
        amount,
        this.selectedVault.fund.decimalPlace
      );
    }
  };
  //   =================================== SEND TRANSACTION
  signAndSendTransaction = async (
    transaction: Transaction,
    signer: Keypair | null = null
  ) => {
    if (this.wallet) {
      transaction.recentBlockhash = (
        await this.connection.getLatestBlockhash("confirmed")
      ).blockhash;
      transaction.feePayer = this.wallet.publicKey;

      if (signer) transaction.partialSign(signer);

      const signedTx = await this.wallet.signTransaction(transaction);
      const rawTransaction = signedTx.serialize();
      const txSig = await this.connection.sendRawTransaction(rawTransaction);
      return txSig;
    } else {
      throw Error("Wallet not found");
    }
  };
  getVaultTopupBalance = async (vault: PublicKey) => {
    const vaultData = await this.program.account.vault.fetch(vault);
    const amountToReturn =
      +vaultData.amountCollected +
      (+vaultData.amountCollected / 10_000) * vaultData.yieldBps;
    const vaultAta = getAssociatedTokenAddressSync(
      vaultData.baseMint,
      vault,
      true
    );
    const currentVaultAtaAmount = await this.connection.getTokenAccountBalance(
      vaultAta
    );
    const amountToTopup =
      amountToReturn -
      +currentVaultAtaAmount.value.amount -
      +vaultData.amountRedeemed;

    return amountToTopup;
  };
  //   =================================== GET USER INFO
  getUserWithdrawAmountWithYield = (amount: number) => {
    if (this.selectedVault && this.selectedVault.vault) {
      const { startDate, endDate, yieldBps } = this.selectedVault.vault;
      const durationSeconds = +endDate - +startDate;
      // Convert annual yield to a per-second yield
      const yieldPerYear = (amount * yieldBps) / 10_000;
      const yieldEarned = (yieldPerYear * durationSeconds) / 31_536_000;
      const payout = amount + yieldEarned;

      return payout;
    }
    return 0;
  };
  confirmTransaction = async (sig: string) => {
    const latestBlockHash = await this.connection.getLatestBlockhash();

    await this.connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: sig,
    });
  };
  refreshState = async () => {
    const vault = await this.getVaultData(whitelistFundsData[0].vault);
    this.selectedVault = { ...this.selectedVault, vault };
    if (this.wallet) {
      const userPda = this.getUserPda(vault.vaultCount, this.wallet.publicKey);
      try {
        this.userSelectedDepositInfo = await this.getUserData(userPda);
      } catch (error) {
        console.log("User account not found");
      }

      const userAta = getAssociatedTokenAddressSync(
        vault.baseMint,
        this.wallet.publicKey
      );
      const userBalance = await this.connection.getTokenAccountBalance(userAta);
      this.selectedVaultUserBaseBalance = +userBalance.value.amount;
    }
    const vaultAta = getAssociatedTokenAddressSync(
      vault.baseMint,
      this.selectedVault.fund.vault,
      true
    );
    const vaultBalance = await this.connection.getTokenAccountBalance(vaultAta);
    this.selectedVaultBalance = +vaultBalance.value.amount;
  };
}
