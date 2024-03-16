import { AnchorError } from "@coral-xyz/anchor";

import Notification from "../components/Notification";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleErrors = (err: any) => {
  console.log(err, "err");
  let msg = err.message;
  try {
    if (err.logs) {
      msg = AnchorError.parse(err.logs);
    }
  } catch (error) {
    console.log(error, "error");
  }

  Notification({ type: "error", title: "Transaction failure", message: msg });
};

export const handleSuccess = (signature: string) => {
  Notification({
    type: "success",
    title: "Submitted",
    message: "Transaction was successful",
    link: `https://solscan.io/tx/${signature}?cluster=${process.env.NEXT_PUBLIC_NETWORK}`,
  });
};

export const accountForDecimal = (amount: number, decimalPlace = 6) => {
  return amount / 10 ** decimalPlace;
};

export const currentTimeFormat = (date: Date) => {
  const formattedTime = date
    .toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .replace(/^0+/, ""); // Remove leading zeros

  const formattedDate = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const finalOutput = `${formattedDate}, ${formattedTime}`;

  return finalOutput;
};
