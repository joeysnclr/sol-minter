import "./App.css";
import { useMemo, useState } from "react";

import Home from "./Home";

import * as anchor from "@project-serum/anchor";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolletExtensionWallet,
} from "@solana/wallet-adapter-wallets";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import { WalletDialogProvider } from "@solana/wallet-adapter-material-ui";
import { createTheme, Input, ThemeProvider } from "@material-ui/core";

const network = "mainnet-beta" as WalletAdapterNetwork;

const rpcHost = "https://api.mainnet-beta.solana.com";
const connection = new anchor.web3.Connection(rpcHost);

const startDateSeed = parseInt("1639420418", 10);

const txTimeout = 30000; // milliseconds (confirm this works for your project)

const theme = createTheme({
  palette: {
    type: "dark",
  },
  overrides: {
    MuiButtonBase: {
      root: {
        justifyContent: "flex-start",
      },
    },
    MuiButton: {
      root: {
        textTransform: undefined,
        padding: "12px 16px",
      },
      startIcon: {
        marginRight: 8,
      },
      endIcon: {
        marginLeft: 8,
      },
    },
  },
});

const App = () => {
  const [treasury, setTreasury] = useState(
    "BJomJVCbjz22kd84scx7X3eqMTBmuqZ4nhiFR7Cvm6dh"
  );
  const [config, setConfig] = useState(
    "GyXJT63bA7oqT3M1fVfG9RHxCieyChP5bH8YNZsDqFEc"
  );
  const [candyMachineId, setCandyMachineId] = useState(
    "8ZjzRkrUPitXCBSp65uK5FsT2476sLZ9NSqtd8kCQJoh"
  );
  const endpoint = useMemo(() => clusterApiUrl(network), []);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSlopeWallet(),
      getSolflareWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network }),
    ],
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setFormSubmitted(true);
        }}
      >
        <Input
          type="text"
          placeholder="treasury"
          value={treasury}
          onChange={(e) => {
            setTreasury(e.target.value);
          }}
        />
        <Input
          type="text"
          placeholder="config"
          value={config}
          onChange={(e) => {
            setConfig(e.target.value);
          }}
        />
        <Input
          type="text"
          placeholder="candyMachine"
          value={candyMachineId}
          onChange={(e) => {
            setCandyMachineId(e.target.value);
          }}
        />
        <Input type="submit" value="Submit" />
      </form>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={true}>
          <WalletDialogProvider>
            {formSubmitted && (
              <Home
                candyMachineId={new anchor.web3.PublicKey(candyMachineId)}
                config={new anchor.web3.PublicKey(config)}
                connection={connection}
                startDate={startDateSeed}
                treasury={new anchor.web3.PublicKey(treasury)}
                txTimeout={txTimeout}
              />
            )}
          </WalletDialogProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
};

export default App;
