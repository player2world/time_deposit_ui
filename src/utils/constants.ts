import { PublicKey } from "@solana/web3.js";

//test for hardcoded version, modify accordingly with the real info
export const fundsData = [
  {
    name: "Aqueous",
    token: "SOL",
    icon: "aqueous",
    apr: 28.0,
    description:
      "The Aqueous Fund is Elemental's flagship fund which produces fixed-yields in $SOL. The fund auto-compounds a portion of its gains, thereby allowing it to grow its APR over time.",
    capacityPercentage: 100,
    capacityTotal: 660,
    capacityCurrent: 660,
    deposit: true,
    withdraw: false,
  },
  {
    name: "Granite",
    token: "USDC",
    icon: "granite",
    apr: 14.0,
    description:
      "The Granite Fund is Elemental's other flagship fund and it produces fixed-yields in $USDC. The fund auto-compounds a portion of its gains, thereby allowing it to grow its APR over time.",
    capacityPercentage: 100,
    capacityTotal: 8500,
    capacityCurrent: 8500,
    deposit: true,
    withdraw: true,
  },
  {
    name: "Tidal",
    token: "SOL",
    icon: "tidal",
    apr: 13.0,
    description:
      "The Tidal Fund is a publicly accessible fund. Unlike the gated funds, Tidal will have a growing deposit capacity, allowing many to participate. However because of this, it will not have the compounding feature that is cornerstone to our flagship funds.",
    capacityPercentage: 59,
    capacityTotal: 2000,
    capacityCurrent: 1170,
    deposit: true,
    withdraw: true,
  },
  {
    name: "Loam",
    token: "USDC",
    icon: "loam",
    apr: 7.0,
    description:
      "The Loam Fund is a publicly accessible fund. Unlike the gated funds, Loam will have a growing deposit capacity, allowing many to participate. However because of this, it will not have the compounding feature that is cornerstone to our flagship funds.",
    capacityPercentage: 73,
    capacityTotal: 60000,
    capacityCurrent: 44000,
    deposit: true,
    withdraw: true,
  },
  {
    name: "Riviera",
    token: "SOL",
    icon: "riviera",
    apr: 15.0,
    description:
      "The Riviera Fund is a premier SOL fund tailored exclusively for high net worth individuals and projects seeking to invest their treasuries in a simple but secure environment. The Riviera Fund delivers exceptional risk-adjusted returns, and personalized attention to its clientele.",
    capacityPercentage: 20,
    capacityTotal: 10000,
    capacityCurrent: 2000,
    deposit: true,
    withdraw: true,
  },
  {
    name: "Geodium",
    token: "USDT",
    icon: "geodium",
    apr: 11.0,
    description:
      "Dedicated to bolstering the liquidity of Raydium's USDC-USDT pool, the Geodium Fund meticulously narrows its exposure, limiting risk primarily to USDT and the USDC-USDT pool on Raydium. This strategic approach places the fund at the lowest end of the risk spectrum",
    capacityPercentage: 20,
    capacityTotal: 10000,
    capacityCurrent: 2000,
    deposit: true,
    withdraw: true,
  },
  {
    name: "Geyser",
    token: "bSOL",
    icon: "geyser",
    apr: 7.0,
    description:
      "The Geyser Fund, a result of our collaboration with SolBlaze, marks an advancement in Elemental's yield strategies. Central to this fund is the layering additional yields on bSOL. bSOL itself is a yield-bearing asset which inherently accumulates yields from Solana itself.",
    capacityPercentage: 20,
    capacityTotal: 10000,
    capacityCurrent: 2000,
    deposit: true,
    withdraw: true,
  },
  // {
  //   name: "Ether",
  //   token: "ETH",
  //   icon: "ether",
  //   apr: 12.0,
  //   description:
  //     "The Ether fund...insert descriptor here.. bla bla bla bla bla bla bla bla bla bla bla bla bla",
  //   capacityPercentage: 20,
  //   capacityTotal: 10000,
  //   capacityCurrent: 2000,
  //   deposit: true,
  //   withdraw: true,
  // },
];

//test for hardcoded version, modify accordingly with the real info
// TEST: UPDATE VAULT PUBKEY
export const whitelistFundsData = [
  {
    vault: new PublicKey("Cp3pviScdGMFmgpuQFie18PF4qopacadqPGPvwUE3Voa"),
    name: "Time Deposit",
    token: "USDC",
    decimalPlace: 6,
    icon: "time-deposit",
    apr: 80.0,
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus convallis et est sed volutpat. Pellentesque a orci purus. In condimentum accumsan enim, et egestas nibh pretium id. Vivamus mattis finibus orci non sollicitudin.",
    capacityPercentage: 100,
    capacityTotal: 50_000 * 10 ** 6, // IN USDC: 1 === 1 USDC
    capacityCurrent: 0,
    deposit: true,
    withdraw: false,
  },
];

// whitelist for authority
export const AUTHORITY_LIST = [
  "4JnxErTCHv6r9f913Mt9tthJfHVMDLZj7K4MWo8FfanD",
  // "FEt4w2awxsxr2P4Mcbo5Z2XuxLBbv3xTJRJ5EY1AA1fS",
  // "DybGDChJMvX9Jnza4XTQVDyUGZ6jYrRg9Q3CdLiEJeh2",
  // "7JqJRm9nzNgRwjVeTgRM861YMjZywfMoDdyTHcZuw3Djy"
];
