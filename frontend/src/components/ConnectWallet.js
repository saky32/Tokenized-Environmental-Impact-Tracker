import React from 'react';
import { BrowserProvider } from 'ethers';

const ConnectWallet = ({ setSigner, setAccount }) => {
  const connect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    setSigner(signer);
    setAccount(address);
  };

  return <button onClick={connect}>Connect Wallet</button>;
};

export default ConnectWallet;
