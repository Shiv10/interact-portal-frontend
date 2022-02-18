import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if(ethereum) {
        console.log("Ethereum object present: ", ethereum);
      } else {
        console.log("Please connect to metamask");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts"});

      if(accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found account: ", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized accounts found.");
      }
    } catch (e) {
      console.log(e);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if(!ethereum) {
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts"});
      console.log("Connected: ", accounts[0]);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect( () => {
    checkIfWalletIsConnected();
  }, []);
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I'm Shivansh. Tell me something funny and you might win a few ETH 👀!
        </div>

        <button className="waveButton" onClick={null}>
          Make the world a funnier place
        </button>

        {
          !currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          )
        }
      </div>
    </div>
  );
}
