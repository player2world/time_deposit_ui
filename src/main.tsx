import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Wallet } from "./components/Wallet.tsx";
import { StoreProvider } from "./utils/Store.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreProvider>
      <Wallet>
        <App />
      </Wallet>
    </StoreProvider>
  </React.StrictMode>
);
